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
import uk.ac.bham.teamproject.domain.DietaryTags;
import uk.ac.bham.teamproject.repository.DietaryTagsRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.DietaryTags}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DietaryTagsResource {

    private final Logger log = LoggerFactory.getLogger(DietaryTagsResource.class);

    private static final String ENTITY_NAME = "dietaryTags";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DietaryTagsRepository dietaryTagsRepository;

    public DietaryTagsResource(DietaryTagsRepository dietaryTagsRepository) {
        this.dietaryTagsRepository = dietaryTagsRepository;
    }

    /**
     * {@code POST  /dietary-tags} : Create a new dietaryTags.
     *
     * @param dietaryTags the dietaryTags to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dietaryTags, or with status {@code 400 (Bad Request)} if the dietaryTags has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dietary-tags")
    public ResponseEntity<DietaryTags> createDietaryTags(@RequestBody DietaryTags dietaryTags) throws URISyntaxException {
        log.debug("REST request to save DietaryTags : {}", dietaryTags);
        if (dietaryTags.getId() != null) {
            throw new BadRequestAlertException("A new dietaryTags cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DietaryTags result = dietaryTagsRepository.save(dietaryTags);
        return ResponseEntity
            .created(new URI("/api/dietary-tags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dietary-tags/:id} : Updates an existing dietaryTags.
     *
     * @param id the id of the dietaryTags to save.
     * @param dietaryTags the dietaryTags to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dietaryTags,
     * or with status {@code 400 (Bad Request)} if the dietaryTags is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dietaryTags couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dietary-tags/{id}")
    public ResponseEntity<DietaryTags> updateDietaryTags(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DietaryTags dietaryTags
    ) throws URISyntaxException {
        log.debug("REST request to update DietaryTags : {}, {}", id, dietaryTags);
        if (dietaryTags.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dietaryTags.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dietaryTagsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DietaryTags result = dietaryTagsRepository.save(dietaryTags);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dietaryTags.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /dietary-tags/:id} : Partial updates given fields of an existing dietaryTags, field will ignore if it is null
     *
     * @param id the id of the dietaryTags to save.
     * @param dietaryTags the dietaryTags to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dietaryTags,
     * or with status {@code 400 (Bad Request)} if the dietaryTags is not valid,
     * or with status {@code 404 (Not Found)} if the dietaryTags is not found,
     * or with status {@code 500 (Internal Server Error)} if the dietaryTags couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dietary-tags/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DietaryTags> partialUpdateDietaryTags(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DietaryTags dietaryTags
    ) throws URISyntaxException {
        log.debug("REST request to partial update DietaryTags partially : {}, {}", id, dietaryTags);
        if (dietaryTags.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dietaryTags.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dietaryTagsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DietaryTags> result = dietaryTagsRepository
            .findById(dietaryTags.getId())
            .map(existingDietaryTags -> {
                if (dietaryTags.getDietary() != null) {
                    existingDietaryTags.setDietary(dietaryTags.getDietary());
                }

                return existingDietaryTags;
            })
            .map(dietaryTagsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dietaryTags.getId().toString())
        );
    }

    /**
     * {@code GET  /dietary-tags} : get all the dietaryTags.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dietaryTags in body.
     */
    @GetMapping("/dietary-tags")
    public List<DietaryTags> getAllDietaryTags(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DietaryTags");
        if (eagerload) {
            return dietaryTagsRepository.findAllWithEagerRelationships();
        } else {
            return dietaryTagsRepository.findAll();
        }
    }

    /**
     * {@code GET  /dietary-tags/:id} : get the "id" dietaryTags.
     *
     * @param id the id of the dietaryTags to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dietaryTags, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dietary-tags/{id}")
    public ResponseEntity<DietaryTags> getDietaryTags(@PathVariable Long id) {
        log.debug("REST request to get DietaryTags : {}", id);
        Optional<DietaryTags> dietaryTags = dietaryTagsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(dietaryTags);
    }

    /**
     * {@code DELETE  /dietary-tags/:id} : delete the "id" dietaryTags.
     *
     * @param id the id of the dietaryTags to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dietary-tags/{id}")
    public ResponseEntity<Void> deleteDietaryTags(@PathVariable Long id) {
        log.debug("REST request to delete DietaryTags : {}", id);
        dietaryTagsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
