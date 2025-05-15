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
import uk.ac.bham.teamproject.domain.Allergens;
import uk.ac.bham.teamproject.repository.AllergensRepository;

/**
 * Integration tests for the {@link AllergensResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AllergensResourceIT {

    private static final Boolean DEFAULT_CELERY = false;
    private static final Boolean UPDATED_CELERY = true;

    private static final Boolean DEFAULT_GLUTEN = false;
    private static final Boolean UPDATED_GLUTEN = true;

    private static final Boolean DEFAULT_CRUSTACEANS = false;
    private static final Boolean UPDATED_CRUSTACEANS = true;

    private static final Boolean DEFAULT_EGG = false;
    private static final Boolean UPDATED_EGG = true;

    private static final Boolean DEFAULT_FISH = false;
    private static final Boolean UPDATED_FISH = true;

    private static final Boolean DEFAULT_LUPIN = false;
    private static final Boolean UPDATED_LUPIN = true;

    private static final Boolean DEFAULT_MILK = false;
    private static final Boolean UPDATED_MILK = true;

    private static final Boolean DEFAULT_MOLLUSCS = false;
    private static final Boolean UPDATED_MOLLUSCS = true;

    private static final Boolean DEFAULT_MUSTARD = false;
    private static final Boolean UPDATED_MUSTARD = true;

    private static final Boolean DEFAULT_NUTS = false;
    private static final Boolean UPDATED_NUTS = true;

    private static final Boolean DEFAULT_PEANUTS = false;
    private static final Boolean UPDATED_PEANUTS = true;

    private static final Boolean DEFAULT_SESAME = false;
    private static final Boolean UPDATED_SESAME = true;

    private static final Boolean DEFAULT_SOYA = false;
    private static final Boolean UPDATED_SOYA = true;

    private static final Boolean DEFAULT_SULPHUR = false;
    private static final Boolean UPDATED_SULPHUR = true;

    private static final String ENTITY_API_URL = "/api/allergens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AllergensRepository allergensRepository;

    @Mock
    private AllergensRepository allergensRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAllergensMockMvc;

    private Allergens allergens;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Allergens createEntity(EntityManager em) {
        Allergens allergens = new Allergens()
            .celery(DEFAULT_CELERY)
            .gluten(DEFAULT_GLUTEN)
            .crustaceans(DEFAULT_CRUSTACEANS)
            .egg(DEFAULT_EGG)
            .fish(DEFAULT_FISH)
            .lupin(DEFAULT_LUPIN)
            .milk(DEFAULT_MILK)
            .molluscs(DEFAULT_MOLLUSCS)
            .mustard(DEFAULT_MUSTARD)
            .nuts(DEFAULT_NUTS)
            .peanuts(DEFAULT_PEANUTS)
            .sesame(DEFAULT_SESAME)
            .soya(DEFAULT_SOYA)
            .sulphur(DEFAULT_SULPHUR);
        return allergens;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Allergens createUpdatedEntity(EntityManager em) {
        Allergens allergens = new Allergens()
            .celery(UPDATED_CELERY)
            .gluten(UPDATED_GLUTEN)
            .crustaceans(UPDATED_CRUSTACEANS)
            .egg(UPDATED_EGG)
            .fish(UPDATED_FISH)
            .lupin(UPDATED_LUPIN)
            .milk(UPDATED_MILK)
            .molluscs(UPDATED_MOLLUSCS)
            .mustard(UPDATED_MUSTARD)
            .nuts(UPDATED_NUTS)
            .peanuts(UPDATED_PEANUTS)
            .sesame(UPDATED_SESAME)
            .soya(UPDATED_SOYA)
            .sulphur(UPDATED_SULPHUR);
        return allergens;
    }

    @BeforeEach
    public void initTest() {
        allergens = createEntity(em);
    }

    @Test
    @Transactional
    void createAllergens() throws Exception {
        int databaseSizeBeforeCreate = allergensRepository.findAll().size();
        // Create the Allergens
        restAllergensMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(allergens)))
            .andExpect(status().isCreated());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeCreate + 1);
        Allergens testAllergens = allergensList.get(allergensList.size() - 1);
        assertThat(testAllergens.getCelery()).isEqualTo(DEFAULT_CELERY);
        assertThat(testAllergens.getGluten()).isEqualTo(DEFAULT_GLUTEN);
        assertThat(testAllergens.getCrustaceans()).isEqualTo(DEFAULT_CRUSTACEANS);
        assertThat(testAllergens.getEgg()).isEqualTo(DEFAULT_EGG);
        assertThat(testAllergens.getFish()).isEqualTo(DEFAULT_FISH);
        assertThat(testAllergens.getLupin()).isEqualTo(DEFAULT_LUPIN);
        assertThat(testAllergens.getMilk()).isEqualTo(DEFAULT_MILK);
        assertThat(testAllergens.getMolluscs()).isEqualTo(DEFAULT_MOLLUSCS);
        assertThat(testAllergens.getMustard()).isEqualTo(DEFAULT_MUSTARD);
        assertThat(testAllergens.getNuts()).isEqualTo(DEFAULT_NUTS);
        assertThat(testAllergens.getPeanuts()).isEqualTo(DEFAULT_PEANUTS);
        assertThat(testAllergens.getSesame()).isEqualTo(DEFAULT_SESAME);
        assertThat(testAllergens.getSoya()).isEqualTo(DEFAULT_SOYA);
        assertThat(testAllergens.getSulphur()).isEqualTo(DEFAULT_SULPHUR);
    }

    @Test
    @Transactional
    void createAllergensWithExistingId() throws Exception {
        // Create the Allergens with an existing ID
        allergens.setId(1L);

        int databaseSizeBeforeCreate = allergensRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAllergensMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(allergens)))
            .andExpect(status().isBadRequest());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAllergens() throws Exception {
        // Initialize the database
        allergensRepository.saveAndFlush(allergens);

        // Get all the allergensList
        restAllergensMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(allergens.getId().intValue())))
            .andExpect(jsonPath("$.[*].celery").value(hasItem(DEFAULT_CELERY.booleanValue())))
            .andExpect(jsonPath("$.[*].gluten").value(hasItem(DEFAULT_GLUTEN.booleanValue())))
            .andExpect(jsonPath("$.[*].crustaceans").value(hasItem(DEFAULT_CRUSTACEANS.booleanValue())))
            .andExpect(jsonPath("$.[*].egg").value(hasItem(DEFAULT_EGG.booleanValue())))
            .andExpect(jsonPath("$.[*].fish").value(hasItem(DEFAULT_FISH.booleanValue())))
            .andExpect(jsonPath("$.[*].lupin").value(hasItem(DEFAULT_LUPIN.booleanValue())))
            .andExpect(jsonPath("$.[*].milk").value(hasItem(DEFAULT_MILK.booleanValue())))
            .andExpect(jsonPath("$.[*].molluscs").value(hasItem(DEFAULT_MOLLUSCS.booleanValue())))
            .andExpect(jsonPath("$.[*].mustard").value(hasItem(DEFAULT_MUSTARD.booleanValue())))
            .andExpect(jsonPath("$.[*].nuts").value(hasItem(DEFAULT_NUTS.booleanValue())))
            .andExpect(jsonPath("$.[*].peanuts").value(hasItem(DEFAULT_PEANUTS.booleanValue())))
            .andExpect(jsonPath("$.[*].sesame").value(hasItem(DEFAULT_SESAME.booleanValue())))
            .andExpect(jsonPath("$.[*].soya").value(hasItem(DEFAULT_SOYA.booleanValue())))
            .andExpect(jsonPath("$.[*].sulphur").value(hasItem(DEFAULT_SULPHUR.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAllergensWithEagerRelationshipsIsEnabled() throws Exception {
        when(allergensRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAllergensMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(allergensRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAllergensWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(allergensRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAllergensMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(allergensRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAllergens() throws Exception {
        // Initialize the database
        allergensRepository.saveAndFlush(allergens);

        // Get the allergens
        restAllergensMockMvc
            .perform(get(ENTITY_API_URL_ID, allergens.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(allergens.getId().intValue()))
            .andExpect(jsonPath("$.celery").value(DEFAULT_CELERY.booleanValue()))
            .andExpect(jsonPath("$.gluten").value(DEFAULT_GLUTEN.booleanValue()))
            .andExpect(jsonPath("$.crustaceans").value(DEFAULT_CRUSTACEANS.booleanValue()))
            .andExpect(jsonPath("$.egg").value(DEFAULT_EGG.booleanValue()))
            .andExpect(jsonPath("$.fish").value(DEFAULT_FISH.booleanValue()))
            .andExpect(jsonPath("$.lupin").value(DEFAULT_LUPIN.booleanValue()))
            .andExpect(jsonPath("$.milk").value(DEFAULT_MILK.booleanValue()))
            .andExpect(jsonPath("$.molluscs").value(DEFAULT_MOLLUSCS.booleanValue()))
            .andExpect(jsonPath("$.mustard").value(DEFAULT_MUSTARD.booleanValue()))
            .andExpect(jsonPath("$.nuts").value(DEFAULT_NUTS.booleanValue()))
            .andExpect(jsonPath("$.peanuts").value(DEFAULT_PEANUTS.booleanValue()))
            .andExpect(jsonPath("$.sesame").value(DEFAULT_SESAME.booleanValue()))
            .andExpect(jsonPath("$.soya").value(DEFAULT_SOYA.booleanValue()))
            .andExpect(jsonPath("$.sulphur").value(DEFAULT_SULPHUR.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAllergens() throws Exception {
        // Get the allergens
        restAllergensMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAllergens() throws Exception {
        // Initialize the database
        allergensRepository.saveAndFlush(allergens);

        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();

        // Update the allergens
        Allergens updatedAllergens = allergensRepository.findById(allergens.getId()).get();
        // Disconnect from session so that the updates on updatedAllergens are not directly saved in db
        em.detach(updatedAllergens);
        updatedAllergens
            .celery(UPDATED_CELERY)
            .gluten(UPDATED_GLUTEN)
            .crustaceans(UPDATED_CRUSTACEANS)
            .egg(UPDATED_EGG)
            .fish(UPDATED_FISH)
            .lupin(UPDATED_LUPIN)
            .milk(UPDATED_MILK)
            .molluscs(UPDATED_MOLLUSCS)
            .mustard(UPDATED_MUSTARD)
            .nuts(UPDATED_NUTS)
            .peanuts(UPDATED_PEANUTS)
            .sesame(UPDATED_SESAME)
            .soya(UPDATED_SOYA)
            .sulphur(UPDATED_SULPHUR);

        restAllergensMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAllergens.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAllergens))
            )
            .andExpect(status().isOk());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
        Allergens testAllergens = allergensList.get(allergensList.size() - 1);
        assertThat(testAllergens.getCelery()).isEqualTo(UPDATED_CELERY);
        assertThat(testAllergens.getGluten()).isEqualTo(UPDATED_GLUTEN);
        assertThat(testAllergens.getCrustaceans()).isEqualTo(UPDATED_CRUSTACEANS);
        assertThat(testAllergens.getEgg()).isEqualTo(UPDATED_EGG);
        assertThat(testAllergens.getFish()).isEqualTo(UPDATED_FISH);
        assertThat(testAllergens.getLupin()).isEqualTo(UPDATED_LUPIN);
        assertThat(testAllergens.getMilk()).isEqualTo(UPDATED_MILK);
        assertThat(testAllergens.getMolluscs()).isEqualTo(UPDATED_MOLLUSCS);
        assertThat(testAllergens.getMustard()).isEqualTo(UPDATED_MUSTARD);
        assertThat(testAllergens.getNuts()).isEqualTo(UPDATED_NUTS);
        assertThat(testAllergens.getPeanuts()).isEqualTo(UPDATED_PEANUTS);
        assertThat(testAllergens.getSesame()).isEqualTo(UPDATED_SESAME);
        assertThat(testAllergens.getSoya()).isEqualTo(UPDATED_SOYA);
        assertThat(testAllergens.getSulphur()).isEqualTo(UPDATED_SULPHUR);
    }

    @Test
    @Transactional
    void putNonExistingAllergens() throws Exception {
        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();
        allergens.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAllergensMockMvc
            .perform(
                put(ENTITY_API_URL_ID, allergens.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(allergens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAllergens() throws Exception {
        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();
        allergens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllergensMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(allergens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAllergens() throws Exception {
        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();
        allergens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllergensMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(allergens)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAllergensWithPatch() throws Exception {
        // Initialize the database
        allergensRepository.saveAndFlush(allergens);

        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();

        // Update the allergens using partial update
        Allergens partialUpdatedAllergens = new Allergens();
        partialUpdatedAllergens.setId(allergens.getId());

        partialUpdatedAllergens
            .celery(UPDATED_CELERY)
            .gluten(UPDATED_GLUTEN)
            .crustaceans(UPDATED_CRUSTACEANS)
            .fish(UPDATED_FISH)
            .lupin(UPDATED_LUPIN)
            .molluscs(UPDATED_MOLLUSCS)
            .mustard(UPDATED_MUSTARD)
            .sulphur(UPDATED_SULPHUR);

        restAllergensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAllergens.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAllergens))
            )
            .andExpect(status().isOk());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
        Allergens testAllergens = allergensList.get(allergensList.size() - 1);
        assertThat(testAllergens.getCelery()).isEqualTo(UPDATED_CELERY);
        assertThat(testAllergens.getGluten()).isEqualTo(UPDATED_GLUTEN);
        assertThat(testAllergens.getCrustaceans()).isEqualTo(UPDATED_CRUSTACEANS);
        assertThat(testAllergens.getEgg()).isEqualTo(DEFAULT_EGG);
        assertThat(testAllergens.getFish()).isEqualTo(UPDATED_FISH);
        assertThat(testAllergens.getLupin()).isEqualTo(UPDATED_LUPIN);
        assertThat(testAllergens.getMilk()).isEqualTo(DEFAULT_MILK);
        assertThat(testAllergens.getMolluscs()).isEqualTo(UPDATED_MOLLUSCS);
        assertThat(testAllergens.getMustard()).isEqualTo(UPDATED_MUSTARD);
        assertThat(testAllergens.getNuts()).isEqualTo(DEFAULT_NUTS);
        assertThat(testAllergens.getPeanuts()).isEqualTo(DEFAULT_PEANUTS);
        assertThat(testAllergens.getSesame()).isEqualTo(DEFAULT_SESAME);
        assertThat(testAllergens.getSoya()).isEqualTo(DEFAULT_SOYA);
        assertThat(testAllergens.getSulphur()).isEqualTo(UPDATED_SULPHUR);
    }

    @Test
    @Transactional
    void fullUpdateAllergensWithPatch() throws Exception {
        // Initialize the database
        allergensRepository.saveAndFlush(allergens);

        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();

        // Update the allergens using partial update
        Allergens partialUpdatedAllergens = new Allergens();
        partialUpdatedAllergens.setId(allergens.getId());

        partialUpdatedAllergens
            .celery(UPDATED_CELERY)
            .gluten(UPDATED_GLUTEN)
            .crustaceans(UPDATED_CRUSTACEANS)
            .egg(UPDATED_EGG)
            .fish(UPDATED_FISH)
            .lupin(UPDATED_LUPIN)
            .milk(UPDATED_MILK)
            .molluscs(UPDATED_MOLLUSCS)
            .mustard(UPDATED_MUSTARD)
            .nuts(UPDATED_NUTS)
            .peanuts(UPDATED_PEANUTS)
            .sesame(UPDATED_SESAME)
            .soya(UPDATED_SOYA)
            .sulphur(UPDATED_SULPHUR);

        restAllergensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAllergens.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAllergens))
            )
            .andExpect(status().isOk());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
        Allergens testAllergens = allergensList.get(allergensList.size() - 1);
        assertThat(testAllergens.getCelery()).isEqualTo(UPDATED_CELERY);
        assertThat(testAllergens.getGluten()).isEqualTo(UPDATED_GLUTEN);
        assertThat(testAllergens.getCrustaceans()).isEqualTo(UPDATED_CRUSTACEANS);
        assertThat(testAllergens.getEgg()).isEqualTo(UPDATED_EGG);
        assertThat(testAllergens.getFish()).isEqualTo(UPDATED_FISH);
        assertThat(testAllergens.getLupin()).isEqualTo(UPDATED_LUPIN);
        assertThat(testAllergens.getMilk()).isEqualTo(UPDATED_MILK);
        assertThat(testAllergens.getMolluscs()).isEqualTo(UPDATED_MOLLUSCS);
        assertThat(testAllergens.getMustard()).isEqualTo(UPDATED_MUSTARD);
        assertThat(testAllergens.getNuts()).isEqualTo(UPDATED_NUTS);
        assertThat(testAllergens.getPeanuts()).isEqualTo(UPDATED_PEANUTS);
        assertThat(testAllergens.getSesame()).isEqualTo(UPDATED_SESAME);
        assertThat(testAllergens.getSoya()).isEqualTo(UPDATED_SOYA);
        assertThat(testAllergens.getSulphur()).isEqualTo(UPDATED_SULPHUR);
    }

    @Test
    @Transactional
    void patchNonExistingAllergens() throws Exception {
        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();
        allergens.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAllergensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, allergens.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(allergens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAllergens() throws Exception {
        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();
        allergens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllergensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(allergens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAllergens() throws Exception {
        int databaseSizeBeforeUpdate = allergensRepository.findAll().size();
        allergens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAllergensMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(allergens))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Allergens in the database
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAllergens() throws Exception {
        // Initialize the database
        allergensRepository.saveAndFlush(allergens);

        int databaseSizeBeforeDelete = allergensRepository.findAll().size();

        // Delete the allergens
        restAllergensMockMvc
            .perform(delete(ENTITY_API_URL_ID, allergens.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Allergens> allergensList = allergensRepository.findAll();
        assertThat(allergensList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
