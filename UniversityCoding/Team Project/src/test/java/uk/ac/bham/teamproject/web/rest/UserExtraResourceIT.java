package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.User;
import uk.ac.bham.teamproject.domain.UserExtra;
import uk.ac.bham.teamproject.repository.UserExtraRepository;
import uk.ac.bham.teamproject.repository.UserRepository;

/**
 * Integration tests for the {@link UserExtraResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UserExtraResourceIT {

    private static final byte[] DEFAULT_PROFILE_PIC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PIC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PIC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PIC_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_BIOGRAPHY = "AAAAAAAAAA";
    private static final String UPDATED_BIOGRAPHY = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PROFILE_BANNER = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_BANNER = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_BANNER_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_BANNER_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final String DEFAULT_PRONOUNS = "AAAAAAAAAA";
    private static final String UPDATED_PRONOUNS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/user-extras";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserExtraRepository userExtraRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private UserExtraRepository userExtraRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserExtraMockMvc;

    private UserExtra userExtra;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtra createEntity(EntityManager em) {
        UserExtra userExtra = new UserExtra()
            .profilePic(DEFAULT_PROFILE_PIC)
            .profilePicContentType(DEFAULT_PROFILE_PIC_CONTENT_TYPE)
            .biography(DEFAULT_BIOGRAPHY)
            .profileBanner(DEFAULT_PROFILE_BANNER)
            .profileBannerContentType(DEFAULT_PROFILE_BANNER_CONTENT_TYPE)
            .age(DEFAULT_AGE)
            .pronouns(DEFAULT_PRONOUNS);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        userExtra.setUser(user);
        return userExtra;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtra createUpdatedEntity(EntityManager em) {
        UserExtra userExtra = new UserExtra()
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .biography(UPDATED_BIOGRAPHY)
            .profileBanner(UPDATED_PROFILE_BANNER)
            .profileBannerContentType(UPDATED_PROFILE_BANNER_CONTENT_TYPE)
            .age(UPDATED_AGE)
            .pronouns(UPDATED_PRONOUNS);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        userExtra.setUser(user);
        return userExtra;
    }

    @BeforeEach
    public void initTest() {
        userExtra = createEntity(em);
    }

    @Test
    @Transactional
    void createUserExtra() throws Exception {
        int databaseSizeBeforeCreate = userExtraRepository.findAll().size();
        // Create the UserExtra
        restUserExtraMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isCreated());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeCreate + 1);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getProfilePic()).isEqualTo(DEFAULT_PROFILE_PIC);
        assertThat(testUserExtra.getProfilePicContentType()).isEqualTo(DEFAULT_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testUserExtra.getBiography()).isEqualTo(DEFAULT_BIOGRAPHY);
        assertThat(testUserExtra.getProfileBanner()).isEqualTo(DEFAULT_PROFILE_BANNER);
        assertThat(testUserExtra.getProfileBannerContentType()).isEqualTo(DEFAULT_PROFILE_BANNER_CONTENT_TYPE);
        assertThat(testUserExtra.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testUserExtra.getPronouns()).isEqualTo(DEFAULT_PRONOUNS);

        // Validate the id for MapsId, the ids must be same
        assertThat(testUserExtra.getId()).isEqualTo(testUserExtra.getUser().getId());
    }

    @Test
    @Transactional
    void createUserExtraWithExistingId() throws Exception {
        // Create the UserExtra with an existing ID
        userExtra.setId(1L);

        int databaseSizeBeforeCreate = userExtraRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserExtraMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void updateUserExtraMapsIdAssociationWithNewId() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);
        int databaseSizeBeforeCreate = userExtraRepository.findAll().size();
        // Add a new parent entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();

        // Load the userExtra
        UserExtra updatedUserExtra = userExtraRepository.findById(userExtra.getId()).get();
        assertThat(updatedUserExtra).isNotNull();
        // Disconnect from session so that the updates on updatedUserExtra are not directly saved in db
        em.detach(updatedUserExtra);

        // Update the User with new association value
        updatedUserExtra.setUser(user);

        // Update the entity
        restUserExtraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserExtra.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserExtra))
            )
            .andExpect(status().isOk());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeCreate);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        // Validate the id for MapsId, the ids must be same
        // Uncomment the following line for assertion. However, please note that there is a known issue and uncommenting will fail the test.
        // Please look at https://github.com/jhipster/generator-jhipster/issues/9100. You can modify this test as necessary.
        // assertThat(testUserExtra.getId()).isEqualTo(testUserExtra.getUser().getId());
    }

    @Test
    @Transactional
    void getAllUserExtras() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        // Get all the userExtraList
        restUserExtraMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userExtra.getId().intValue())))
            .andExpect(jsonPath("$.[*].profilePicContentType").value(hasItem(DEFAULT_PROFILE_PIC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePic").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PIC))))
            .andExpect(jsonPath("$.[*].biography").value(hasItem(DEFAULT_BIOGRAPHY)))
            .andExpect(jsonPath("$.[*].profileBannerContentType").value(hasItem(DEFAULT_PROFILE_BANNER_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profileBanner").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_BANNER))))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].pronouns").value(hasItem(DEFAULT_PRONOUNS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserExtrasWithEagerRelationshipsIsEnabled() throws Exception {
        when(userExtraRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserExtraMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(userExtraRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserExtrasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(userExtraRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserExtraMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(userExtraRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUserExtra() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        // Get the userExtra
        restUserExtraMockMvc
            .perform(get(ENTITY_API_URL_ID, userExtra.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userExtra.getId().intValue()))
            .andExpect(jsonPath("$.profilePicContentType").value(DEFAULT_PROFILE_PIC_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePic").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PIC)))
            .andExpect(jsonPath("$.biography").value(DEFAULT_BIOGRAPHY))
            .andExpect(jsonPath("$.profileBannerContentType").value(DEFAULT_PROFILE_BANNER_CONTENT_TYPE))
            .andExpect(jsonPath("$.profileBanner").value(Base64Utils.encodeToString(DEFAULT_PROFILE_BANNER)))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.pronouns").value(DEFAULT_PRONOUNS));
    }

    @Test
    @Transactional
    void getNonExistingUserExtra() throws Exception {
        // Get the userExtra
        restUserExtraMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserExtra() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Update the userExtra
        UserExtra updatedUserExtra = userExtraRepository.findById(userExtra.getId()).get();
        // Disconnect from session so that the updates on updatedUserExtra are not directly saved in db
        em.detach(updatedUserExtra);
        updatedUserExtra
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .biography(UPDATED_BIOGRAPHY)
            .profileBanner(UPDATED_PROFILE_BANNER)
            .profileBannerContentType(UPDATED_PROFILE_BANNER_CONTENT_TYPE)
            .age(UPDATED_AGE)
            .pronouns(UPDATED_PRONOUNS);

        restUserExtraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserExtra.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserExtra))
            )
            .andExpect(status().isOk());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getProfilePic()).isEqualTo(UPDATED_PROFILE_PIC);
        assertThat(testUserExtra.getProfilePicContentType()).isEqualTo(UPDATED_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testUserExtra.getBiography()).isEqualTo(UPDATED_BIOGRAPHY);
        assertThat(testUserExtra.getProfileBanner()).isEqualTo(UPDATED_PROFILE_BANNER);
        assertThat(testUserExtra.getProfileBannerContentType()).isEqualTo(UPDATED_PROFILE_BANNER_CONTENT_TYPE);
        assertThat(testUserExtra.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testUserExtra.getPronouns()).isEqualTo(UPDATED_PRONOUNS);
    }

    @Test
    @Transactional
    void putNonExistingUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();
        userExtra.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userExtra.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtra))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();
        userExtra.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtraMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userExtra))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();
        userExtra.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtraMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userExtra)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserExtraWithPatch() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Update the userExtra using partial update
        UserExtra partialUpdatedUserExtra = new UserExtra();
        partialUpdatedUserExtra.setId(userExtra.getId());

        partialUpdatedUserExtra
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .age(UPDATED_AGE)
            .pronouns(UPDATED_PRONOUNS);

        restUserExtraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserExtra.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserExtra))
            )
            .andExpect(status().isOk());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getProfilePic()).isEqualTo(UPDATED_PROFILE_PIC);
        assertThat(testUserExtra.getProfilePicContentType()).isEqualTo(UPDATED_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testUserExtra.getBiography()).isEqualTo(DEFAULT_BIOGRAPHY);
        assertThat(testUserExtra.getProfileBanner()).isEqualTo(DEFAULT_PROFILE_BANNER);
        assertThat(testUserExtra.getProfileBannerContentType()).isEqualTo(DEFAULT_PROFILE_BANNER_CONTENT_TYPE);
        assertThat(testUserExtra.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testUserExtra.getPronouns()).isEqualTo(UPDATED_PRONOUNS);
    }

    @Test
    @Transactional
    void fullUpdateUserExtraWithPatch() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Update the userExtra using partial update
        UserExtra partialUpdatedUserExtra = new UserExtra();
        partialUpdatedUserExtra.setId(userExtra.getId());

        partialUpdatedUserExtra
            .profilePic(UPDATED_PROFILE_PIC)
            .profilePicContentType(UPDATED_PROFILE_PIC_CONTENT_TYPE)
            .biography(UPDATED_BIOGRAPHY)
            .profileBanner(UPDATED_PROFILE_BANNER)
            .profileBannerContentType(UPDATED_PROFILE_BANNER_CONTENT_TYPE)
            .age(UPDATED_AGE)
            .pronouns(UPDATED_PRONOUNS);

        restUserExtraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserExtra.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserExtra))
            )
            .andExpect(status().isOk());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getProfilePic()).isEqualTo(UPDATED_PROFILE_PIC);
        assertThat(testUserExtra.getProfilePicContentType()).isEqualTo(UPDATED_PROFILE_PIC_CONTENT_TYPE);
        assertThat(testUserExtra.getBiography()).isEqualTo(UPDATED_BIOGRAPHY);
        assertThat(testUserExtra.getProfileBanner()).isEqualTo(UPDATED_PROFILE_BANNER);
        assertThat(testUserExtra.getProfileBannerContentType()).isEqualTo(UPDATED_PROFILE_BANNER_CONTENT_TYPE);
        assertThat(testUserExtra.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testUserExtra.getPronouns()).isEqualTo(UPDATED_PRONOUNS);
    }

    @Test
    @Transactional
    void patchNonExistingUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();
        userExtra.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserExtraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userExtra.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtra))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();
        userExtra.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtraMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userExtra))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserExtra() throws Exception {
        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();
        userExtra.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserExtraMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userExtra))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserExtra() throws Exception {
        // Initialize the database
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeDelete = userExtraRepository.findAll().size();

        // Delete the userExtra
        restUserExtraMockMvc
            .perform(delete(ENTITY_API_URL_ID, userExtra.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
