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
import uk.ac.bham.teamproject.domain.LikedBy;
import uk.ac.bham.teamproject.repository.LikedByRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.LikedBy}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LikedByResource {

    private final Logger log = LoggerFactory.getLogger(LikedByResource.class);

    private static final String ENTITY_NAME = "likedBy";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LikedByRepository likedByRepository;

    public LikedByResource(LikedByRepository likedByRepository) {
        this.likedByRepository = likedByRepository;
    }

    /**
     * {@code POST  /liked-bies} : Create a new likedBy.
     *
     * @param likedBy the likedBy to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new likedBy, or with status {@code 400 (Bad Request)} if the likedBy has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/liked-bies")
    public ResponseEntity<LikedBy> createLikedBy(@RequestBody LikedBy likedBy) throws URISyntaxException {
        log.debug("REST request to save LikedBy : {}", likedBy);
        if (likedBy.getId() != null) {
            throw new BadRequestAlertException("A new likedBy cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LikedBy result = likedByRepository.save(likedBy);
        return ResponseEntity
            .created(new URI("/api/liked-bies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /liked-bies/:id} : Updates an existing likedBy.
     *
     * @param id the id of the likedBy to save.
     * @param likedBy the likedBy to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated likedBy,
     * or with status {@code 400 (Bad Request)} if the likedBy is not valid,
     * or with status {@code 500 (Internal Server Error)} if the likedBy couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/liked-bies/{id}")
    public ResponseEntity<LikedBy> updateLikedBy(@PathVariable(value = "id", required = false) final Long id, @RequestBody LikedBy likedBy)
        throws URISyntaxException {
        log.debug("REST request to update LikedBy : {}, {}", id, likedBy);
        if (likedBy.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, likedBy.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!likedByRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LikedBy result = likedByRepository.save(likedBy);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, likedBy.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /liked-bies/:id} : Partial updates given fields of an existing likedBy, field will ignore if it is null
     *
     * @param id the id of the likedBy to save.
     * @param likedBy the likedBy to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated likedBy,
     * or with status {@code 400 (Bad Request)} if the likedBy is not valid,
     * or with status {@code 404 (Not Found)} if the likedBy is not found,
     * or with status {@code 500 (Internal Server Error)} if the likedBy couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/liked-bies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LikedBy> partialUpdateLikedBy(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LikedBy likedBy
    ) throws URISyntaxException {
        log.debug("REST request to partial update LikedBy partially : {}, {}", id, likedBy);
        if (likedBy.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, likedBy.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!likedByRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LikedBy> result = likedByRepository
            .findById(likedBy.getId())
            .map(existingLikedBy -> {
                if (likedBy.getLiked() != null) {
                    existingLikedBy.setLiked(likedBy.getLiked());
                }

                return existingLikedBy;
            })
            .map(likedByRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, likedBy.getId().toString())
        );
    }

    /**
     * {@code GET  /liked-bies} : get all the likedBies.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of likedBies in body.
     */
    @GetMapping("/liked-bies")
    public List<LikedBy> getAllLikedBies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all LikedBies");
        if (eagerload) {
            return likedByRepository.findAllWithEagerRelationships();
        } else {
            return likedByRepository.findAll();
        }
    }

    /**
     * {@code GET  /liked-bies/:id} : get the "id" likedBy.
     *
     * @param id the id of the likedBy to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the likedBy, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/liked-bies/{id}")
    public ResponseEntity<LikedBy> getLikedBy(@PathVariable Long id) {
        log.debug("REST request to get LikedBy : {}", id);
        Optional<LikedBy> likedBy = likedByRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(likedBy);
    }

    /**
     * {@code DELETE  /liked-bies/:id} : delete the "id" likedBy.
     *
     * @param id the id of the likedBy to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/liked-bies/{id}")
    public ResponseEntity<Void> deleteLikedBy(@PathVariable Long id) {
        log.debug("REST request to delete LikedBy : {}", id);
        likedByRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
