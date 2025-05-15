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
import uk.ac.bham.teamproject.domain.DietaryTags;
import uk.ac.bham.teamproject.repository.DietaryTagsRepository;

/**
 * Integration tests for the {@link DietaryTagsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DietaryTagsResourceIT {

    private static final String DEFAULT_DIETARY = "AAAAAAAAAA";
    private static final String UPDATED_DIETARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/dietary-tags";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DietaryTagsRepository dietaryTagsRepository;

    @Mock
    private DietaryTagsRepository dietaryTagsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDietaryTagsMockMvc;

    private DietaryTags dietaryTags;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DietaryTags createEntity(EntityManager em) {
        DietaryTags dietaryTags = new DietaryTags().dietary(DEFAULT_DIETARY);
        return dietaryTags;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DietaryTags createUpdatedEntity(EntityManager em) {
        DietaryTags dietaryTags = new DietaryTags().dietary(UPDATED_DIETARY);
        return dietaryTags;
    }

    @BeforeEach
    public void initTest() {
        dietaryTags = createEntity(em);
    }

    @Test
    @Transactional
    void createDietaryTags() throws Exception {
        int databaseSizeBeforeCreate = dietaryTagsRepository.findAll().size();
        // Create the DietaryTags
        restDietaryTagsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dietaryTags)))
            .andExpect(status().isCreated());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeCreate + 1);
        DietaryTags testDietaryTags = dietaryTagsList.get(dietaryTagsList.size() - 1);
        assertThat(testDietaryTags.getDietary()).isEqualTo(DEFAULT_DIETARY);
    }

    @Test
    @Transactional
    void createDietaryTagsWithExistingId() throws Exception {
        // Create the DietaryTags with an existing ID
        dietaryTags.setId(1L);

        int databaseSizeBeforeCreate = dietaryTagsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDietaryTagsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dietaryTags)))
            .andExpect(status().isBadRequest());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDietaryTags() throws Exception {
        // Initialize the database
        dietaryTagsRepository.saveAndFlush(dietaryTags);

        // Get all the dietaryTagsList
        restDietaryTagsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dietaryTags.getId().intValue())))
            .andExpect(jsonPath("$.[*].dietary").value(hasItem(DEFAULT_DIETARY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDietaryTagsWithEagerRelationshipsIsEnabled() throws Exception {
        when(dietaryTagsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDietaryTagsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(dietaryTagsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDietaryTagsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(dietaryTagsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDietaryTagsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(dietaryTagsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDietaryTags() throws Exception {
        // Initialize the database
        dietaryTagsRepository.saveAndFlush(dietaryTags);

        // Get the dietaryTags
        restDietaryTagsMockMvc
            .perform(get(ENTITY_API_URL_ID, dietaryTags.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dietaryTags.getId().intValue()))
            .andExpect(jsonPath("$.dietary").value(DEFAULT_DIETARY));
    }

    @Test
    @Transactional
    void getNonExistingDietaryTags() throws Exception {
        // Get the dietaryTags
        restDietaryTagsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDietaryTags() throws Exception {
        // Initialize the database
        dietaryTagsRepository.saveAndFlush(dietaryTags);

        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();

        // Update the dietaryTags
        DietaryTags updatedDietaryTags = dietaryTagsRepository.findById(dietaryTags.getId()).get();
        // Disconnect from session so that the updates on updatedDietaryTags are not directly saved in db
        em.detach(updatedDietaryTags);
        updatedDietaryTags.dietary(UPDATED_DIETARY);

        restDietaryTagsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDietaryTags.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDietaryTags))
            )
            .andExpect(status().isOk());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
        DietaryTags testDietaryTags = dietaryTagsList.get(dietaryTagsList.size() - 1);
        assertThat(testDietaryTags.getDietary()).isEqualTo(UPDATED_DIETARY);
    }

    @Test
    @Transactional
    void putNonExistingDietaryTags() throws Exception {
        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();
        dietaryTags.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDietaryTagsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dietaryTags.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dietaryTags))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDietaryTags() throws Exception {
        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();
        dietaryTags.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryTagsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dietaryTags))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDietaryTags() throws Exception {
        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();
        dietaryTags.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryTagsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dietaryTags)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDietaryTagsWithPatch() throws Exception {
        // Initialize the database
        dietaryTagsRepository.saveAndFlush(dietaryTags);

        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();

        // Update the dietaryTags using partial update
        DietaryTags partialUpdatedDietaryTags = new DietaryTags();
        partialUpdatedDietaryTags.setId(dietaryTags.getId());

        partialUpdatedDietaryTags.dietary(UPDATED_DIETARY);

        restDietaryTagsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDietaryTags.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDietaryTags))
            )
            .andExpect(status().isOk());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
        DietaryTags testDietaryTags = dietaryTagsList.get(dietaryTagsList.size() - 1);
        assertThat(testDietaryTags.getDietary()).isEqualTo(UPDATED_DIETARY);
    }

    @Test
    @Transactional
    void fullUpdateDietaryTagsWithPatch() throws Exception {
        // Initialize the database
        dietaryTagsRepository.saveAndFlush(dietaryTags);

        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();

        // Update the dietaryTags using partial update
        DietaryTags partialUpdatedDietaryTags = new DietaryTags();
        partialUpdatedDietaryTags.setId(dietaryTags.getId());

        partialUpdatedDietaryTags.dietary(UPDATED_DIETARY);

        restDietaryTagsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDietaryTags.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDietaryTags))
            )
            .andExpect(status().isOk());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
        DietaryTags testDietaryTags = dietaryTagsList.get(dietaryTagsList.size() - 1);
        assertThat(testDietaryTags.getDietary()).isEqualTo(UPDATED_DIETARY);
    }

    @Test
    @Transactional
    void patchNonExistingDietaryTags() throws Exception {
        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();
        dietaryTags.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDietaryTagsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dietaryTags.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dietaryTags))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDietaryTags() throws Exception {
        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();
        dietaryTags.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryTagsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dietaryTags))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDietaryTags() throws Exception {
        int databaseSizeBeforeUpdate = dietaryTagsRepository.findAll().size();
        dietaryTags.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryTagsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dietaryTags))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DietaryTags in the database
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDietaryTags() throws Exception {
        // Initialize the database
        dietaryTagsRepository.saveAndFlush(dietaryTags);

        int databaseSizeBeforeDelete = dietaryTagsRepository.findAll().size();

        // Delete the dietaryTags
        restDietaryTagsMockMvc
            .perform(delete(ENTITY_API_URL_ID, dietaryTags.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DietaryTags> dietaryTagsList = dietaryTagsRepository.findAll();
        assertThat(dietaryTagsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
