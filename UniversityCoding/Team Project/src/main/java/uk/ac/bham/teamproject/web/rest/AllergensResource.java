package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Allergens;
import uk.ac.bham.teamproject.repository.AllergensRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Allergens}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AllergensResource {

    private final Logger log = LoggerFactory.getLogger(AllergensResource.class);

    private static final String ENTITY_NAME = "allergens";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AllergensRepository allergensRepository;

    public AllergensResource(AllergensRepository allergensRepository) {
        this.allergensRepository = allergensRepository;
    }

    /**
     * {@code POST  /allergens} : Create a new allergens.
     *
     * @param allergens the allergens to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new allergens, or with status {@code 400 (Bad Request)} if the allergens has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/allergens")
    public ResponseEntity<Allergens> createAllergens(@RequestBody Allergens allergens) throws URISyntaxException {
        log.debug("REST request to save Allergens : {}", allergens);
        if (allergens.getId() != null) {
            throw new BadRequestAlertException("A new allergens cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Allergens result = allergensRepository.save(allergens);
        return ResponseEntity
            .created(new URI("/api/allergens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /allergens/:id} : Updates an existing allergens.
     *
     * @param id the id of the allergens to save.
     * @param allergens the allergens to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated allergens,
     * or with status {@code 400 (Bad Request)} if the allergens is not valid,
     * or with status {@code 500 (Internal Server Error)} if the allergens couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/allergens/{id}")
    public ResponseEntity<Allergens> updateAllergens(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Allergens allergens
    ) throws URISyntaxException {
        log.debug("REST request to update Allergens : {}, {}", id, allergens);
        if (allergens.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, allergens.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!allergensRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Allergens result = allergensRepository.save(allergens);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, allergens.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /allergens/:id} : Partial updates given fields of an existing allergens, field will ignore if it is null
     *
     * @param id the id of the allergens to save.
     * @param allergens the allergens to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated allergens,
     * or with status {@code 400 (Bad Request)} if the allergens is not valid,
     * or with status {@code 404 (Not Found)} if the allergens is not found,
     * or with status {@code 500 (Internal Server Error)} if the allergens couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/allergens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Allergens> partialUpdateAllergens(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Allergens allergens
    ) throws URISyntaxException {
        log.debug("REST request to partial update Allergens partially : {}, {}", id, allergens);
        if (allergens.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, allergens.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!allergensRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Allergens> result = allergensRepository
            .findById(allergens.getId())
            .map(existingAllergens -> {
                if (allergens.getCelery() != null) {
                    existingAllergens.setCelery(allergens.getCelery());
                }
                if (allergens.getGluten() != null) {
                    existingAllergens.setGluten(allergens.getGluten());
                }
                if (allergens.getCrustaceans() != null) {
                    existingAllergens.setCrustaceans(allergens.getCrustaceans());
                }
                if (allergens.getEgg() != null) {
                    existingAllergens.setEgg(allergens.getEgg());
                }
                if (allergens.getFish() != null) {
                    existingAllergens.setFish(allergens.getFish());
                }
                if (allergens.getLupin() != null) {
                    existingAllergens.setLupin(allergens.getLupin());
                }
                if (allergens.getMilk() != null) {
                    existingAllergens.setMilk(allergens.getMilk());
                }
                if (allergens.getMolluscs() != null) {
                    existingAllergens.setMolluscs(allergens.getMolluscs());
                }
                if (allergens.getMustard() != null) {
                    existingAllergens.setMustard(allergens.getMustard());
                }
                if (allergens.getNuts() != null) {
                    existingAllergens.setNuts(allergens.getNuts());
                }
                if (allergens.getPeanuts() != null) {
                    existingAllergens.setPeanuts(allergens.getPeanuts());
                }
                if (allergens.getSesame() != null) {
                    existingAllergens.setSesame(allergens.getSesame());
                }
                if (allergens.getSoya() != null) {
                    existingAllergens.setSoya(allergens.getSoya());
                }
                if (allergens.getSulphur() != null) {
                    existingAllergens.setSulphur(allergens.getSulphur());
                }

                return existingAllergens;
            })
            .map(allergensRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, allergens.getId().toString())
        );
    }

    /**
     * {@code GET  /allergens} : get all the allergens.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of allergens in body.
     */
    @GetMapping("/allergens")
    public List<Allergens> getAllAllergens(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Allergens");
        if (eagerload) {
            return allergensRepository.findAllWithEagerRelationships();
        } else {
            return allergensRepository.findAll();
        }
    }

    /**
     * {@code GET  /allergens/:id} : get the "id" allergens.
     *
     * @param id the id of the allergens to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the allergens, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/allergens/{id}")
    public ResponseEntity<Allergens> getAllergens(@PathVariable Long id) {
        log.debug("REST request to get Allergens : {}", id);
        Optional<Allergens> allergens = allergensRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(allergens);
    }

    /**
     * {@code DELETE  /allergens/:id} : delete the "id" allergens.
     *
     * @param id the id of the allergens to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/allergens/{id}")
    public ResponseEntity<Void> deleteAllergens(@PathVariable Long id) {
        log.debug("REST request to delete Allergens : {}", id);
        allergensRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
