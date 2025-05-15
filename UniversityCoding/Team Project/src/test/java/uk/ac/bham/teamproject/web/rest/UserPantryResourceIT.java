package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.UserPantry;
import uk.ac.bham.teamproject.repository.UserPantryRepository;

/**
 * Integration tests for the {@link UserPantryResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UserPantryResourceIT {

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/user-pantries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserPantryRepository userPantryRepository;

    @Mock
    private UserPantryRepository userPantryRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserPantryMockMvc;

    private UserPantry userPantry;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPantry createEntity(EntityManager em) {
        UserPantry userPantry = new UserPantry().timestamp(DEFAULT_TIMESTAMP);
        return userPantry;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserPantry createUpdatedEntity(EntityManager em) {
        UserPantry userPantry = new UserPantry().timestamp(UPDATED_TIMESTAMP);
        return userPantry;
    }

    @BeforeEach
    public void initTest() {
        userPantry = createEntity(em);
    }

    @Test
    @Transactional
    void createUserPantry() throws Exception {
        int databaseSizeBeforeCreate = userPantryRepository.findAll().size();
        // Create the UserPantry
        restUserPantryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPantry)))
            .andExpect(status().isCreated());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeCreate + 1);
        UserPantry testUserPantry = userPantryList.get(userPantryList.size() - 1);
        assertThat(testUserPantry.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
    }

    @Test
    @Transactional
    void createUserPantryWithExistingId() throws Exception {
        // Create the UserPantry with an existing ID
        userPantry.setId(1L);

        int databaseSizeBeforeCreate = userPantryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserPantryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPantry)))
            .andExpect(status().isBadRequest());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserPantries() throws Exception {
        // Initialize the database
        userPantryRepository.saveAndFlush(userPantry);

        // Get all the userPantryList
        restUserPantryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userPantry.getId().intValue())))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserPantriesWithEagerRelationshipsIsEnabled() throws Exception {
        when(userPantryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserPantryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(userPantryRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUserPantriesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(userPantryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUserPantryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(userPantryRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getUserPantry() throws Exception {
        // Initialize the database
        userPantryRepository.saveAndFlush(userPantry);

        // Get the userPantry
        restUserPantryMockMvc
            .perform(get(ENTITY_API_URL_ID, userPantry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userPantry.getId().intValue()))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUserPantry() throws Exception {
        // Get the userPantry
        restUserPantryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserPantry() throws Exception {
        // Initialize the database
        userPantryRepository.saveAndFlush(userPantry);

        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();

        // Update the userPantry
        UserPantry updatedUserPantry = userPantryRepository.findById(userPantry.getId()).get();
        // Disconnect from session so that the updates on updatedUserPantry are not directly saved in db
        em.detach(updatedUserPantry);
        updatedUserPantry.timestamp(UPDATED_TIMESTAMP);

        restUserPantryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserPantry.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserPantry))
            )
            .andExpect(status().isOk());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
        UserPantry testUserPantry = userPantryList.get(userPantryList.size() - 1);
        assertThat(testUserPantry.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void putNonExistingUserPantry() throws Exception {
        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();
        userPantry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPantryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userPantry.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPantry))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserPantry() throws Exception {
        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();
        userPantry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPantryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userPantry))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserPantry() throws Exception {
        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();
        userPantry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPantryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userPantry)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserPantryWithPatch() throws Exception {
        // Initialize the database
        userPantryRepository.saveAndFlush(userPantry);

        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();

        // Update the userPantry using partial update
        UserPantry partialUpdatedUserPantry = new UserPantry();
        partialUpdatedUserPantry.setId(userPantry.getId());

        partialUpdatedUserPantry.timestamp(UPDATED_TIMESTAMP);

        restUserPantryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPantry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPantry))
            )
            .andExpect(status().isOk());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
        UserPantry testUserPantry = userPantryList.get(userPantryList.size() - 1);
        assertThat(testUserPantry.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void fullUpdateUserPantryWithPatch() throws Exception {
        // Initialize the database
        userPantryRepository.saveAndFlush(userPantry);

        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();

        // Update the userPantry using partial update
        UserPantry partialUpdatedUserPantry = new UserPantry();
        partialUpdatedUserPantry.setId(userPantry.getId());

        partialUpdatedUserPantry.timestamp(UPDATED_TIMESTAMP);

        restUserPantryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserPantry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserPantry))
            )
            .andExpect(status().isOk());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
        UserPantry testUserPantry = userPantryList.get(userPantryList.size() - 1);
        assertThat(testUserPantry.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
    }

    @Test
    @Transactional
    void patchNonExistingUserPantry() throws Exception {
        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();
        userPantry.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserPantryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userPantry.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPantry))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserPantry() throws Exception {
        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();
        userPantry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPantryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userPantry))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserPantry() throws Exception {
        int databaseSizeBeforeUpdate = userPantryRepository.findAll().size();
        userPantry.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserPantryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userPantry))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserPantry in the database
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserPantry() throws Exception {
        // Initialize the database
        userPantryRepository.saveAndFlush(userPantry);

        int databaseSizeBeforeDelete = userPantryRepository.findAll().size();

        // Delete the userPantry
        restUserPantryMockMvc
            .perform(delete(ENTITY_API_URL_ID, userPantry.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserPantry> userPantryList = userPantryRepository.findAll();
        assertThat(userPantryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
