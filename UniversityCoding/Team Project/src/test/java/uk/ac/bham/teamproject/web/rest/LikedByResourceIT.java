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
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.LikedBy;
import uk.ac.bham.teamproject.repository.LikedByRepository;

/**
 * Integration tests for the {@link LikedByResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class LikedByResourceIT {

    private static final Boolean DEFAULT_LIKED = false;
    private static final Boolean UPDATED_LIKED = true;

    private static final String ENTITY_API_URL = "/api/liked-bies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LikedByRepository likedByRepository;

    @Mock
    private LikedByRepository likedByRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLikedByMockMvc;

    private LikedBy likedBy;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LikedBy createEntity(EntityManager em) {
        LikedBy likedBy = new LikedBy().liked(DEFAULT_LIKED);
        return likedBy;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LikedBy createUpdatedEntity(EntityManager em) {
        LikedBy likedBy = new LikedBy().liked(UPDATED_LIKED);
        return likedBy;
    }

    @BeforeEach
    public void initTest() {
        likedBy = createEntity(em);
    }

    @Test
    @Transactional
    void createLikedBy() throws Exception {
        int databaseSizeBeforeCreate = likedByRepository.findAll().size();
        // Create the LikedBy
        restLikedByMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedBy)))
            .andExpect(status().isCreated());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeCreate + 1);
        LikedBy testLikedBy = likedByList.get(likedByList.size() - 1);
        assertThat(testLikedBy.getLiked()).isEqualTo(DEFAULT_LIKED);
    }

    @Test
    @Transactional
    void createLikedByWithExistingId() throws Exception {
        // Create the LikedBy with an existing ID
        likedBy.setId(1L);

        int databaseSizeBeforeCreate = likedByRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLikedByMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedBy)))
            .andExpect(status().isBadRequest());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLikedBies() throws Exception {
        // Initialize the database
        likedByRepository.saveAndFlush(likedBy);

        // Get all the likedByList
        restLikedByMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(likedBy.getId().intValue())))
            .andExpect(jsonPath("$.[*].liked").value(hasItem(DEFAULT_LIKED.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLikedBiesWithEagerRelationshipsIsEnabled() throws Exception {
        when(likedByRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLikedByMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(likedByRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllLikedBiesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(likedByRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restLikedByMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(likedByRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getLikedBy() throws Exception {
        // Initialize the database
        likedByRepository.saveAndFlush(likedBy);

        // Get the likedBy
        restLikedByMockMvc
            .perform(get(ENTITY_API_URL_ID, likedBy.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(likedBy.getId().intValue()))
            .andExpect(jsonPath("$.liked").value(DEFAULT_LIKED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingLikedBy() throws Exception {
        // Get the likedBy
        restLikedByMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLikedBy() throws Exception {
        // Initialize the database
        likedByRepository.saveAndFlush(likedBy);

        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();

        // Update the likedBy
        LikedBy updatedLikedBy = likedByRepository.findById(likedBy.getId()).get();
        // Disconnect from session so that the updates on updatedLikedBy are not directly saved in db
        em.detach(updatedLikedBy);
        updatedLikedBy.liked(UPDATED_LIKED);

        restLikedByMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLikedBy.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLikedBy))
            )
            .andExpect(status().isOk());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
        LikedBy testLikedBy = likedByList.get(likedByList.size() - 1);
        assertThat(testLikedBy.getLiked()).isEqualTo(UPDATED_LIKED);
    }

    @Test
    @Transactional
    void putNonExistingLikedBy() throws Exception {
        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();
        likedBy.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLikedByMockMvc
            .perform(
                put(ENTITY_API_URL_ID, likedBy.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(likedBy))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLikedBy() throws Exception {
        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();
        likedBy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedByMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(likedBy))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLikedBy() throws Exception {
        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();
        likedBy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedByMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(likedBy)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLikedByWithPatch() throws Exception {
        // Initialize the database
        likedByRepository.saveAndFlush(likedBy);

        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();

        // Update the likedBy using partial update
        LikedBy partialUpdatedLikedBy = new LikedBy();
        partialUpdatedLikedBy.setId(likedBy.getId());

        partialUpdatedLikedBy.liked(UPDATED_LIKED);

        restLikedByMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLikedBy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLikedBy))
            )
            .andExpect(status().isOk());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
        LikedBy testLikedBy = likedByList.get(likedByList.size() - 1);
        assertThat(testLikedBy.getLiked()).isEqualTo(UPDATED_LIKED);
    }

    @Test
    @Transactional
    void fullUpdateLikedByWithPatch() throws Exception {
        // Initialize the database
        likedByRepository.saveAndFlush(likedBy);

        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();

        // Update the likedBy using partial update
        LikedBy partialUpdatedLikedBy = new LikedBy();
        partialUpdatedLikedBy.setId(likedBy.getId());

        partialUpdatedLikedBy.liked(UPDATED_LIKED);

        restLikedByMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLikedBy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLikedBy))
            )
            .andExpect(status().isOk());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
        LikedBy testLikedBy = likedByList.get(likedByList.size() - 1);
        assertThat(testLikedBy.getLiked()).isEqualTo(UPDATED_LIKED);
    }

    @Test
    @Transactional
    void patchNonExistingLikedBy() throws Exception {
        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();
        likedBy.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLikedByMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, likedBy.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(likedBy))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLikedBy() throws Exception {
        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();
        likedBy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedByMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(likedBy))
            )
            .andExpect(status().isBadRequest());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLikedBy() throws Exception {
        int databaseSizeBeforeUpdate = likedByRepository.findAll().size();
        likedBy.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLikedByMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(likedBy)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LikedBy in the database
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLikedBy() throws Exception {
        // Initialize the database
        likedByRepository.saveAndFlush(likedBy);

        int databaseSizeBeforeDelete = likedByRepository.findAll().size();

        // Delete the likedBy
        restLikedByMockMvc
            .perform(delete(ENTITY_API_URL_ID, likedBy.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LikedBy> likedByList = likedByRepository.findAll();
        assertThat(likedByList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
