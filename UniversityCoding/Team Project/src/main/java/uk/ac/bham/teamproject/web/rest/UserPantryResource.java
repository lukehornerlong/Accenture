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
import uk.ac.bham.teamproject.domain.UserPantry;
import uk.ac.bham.teamproject.repository.UserPantryRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.UserPantry}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserPantryResource {

    private final Logger log = LoggerFactory.getLogger(UserPantryResource.class);

    private static final String ENTITY_NAME = "userPantry";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserPantryRepository userPantryRepository;

    public UserPantryResource(UserPantryRepository userPantryRepository) {
        this.userPantryRepository = userPantryRepository;
    }

    /**
     * {@code POST  /user-pantries} : Create a new userPantry.
     *
     * @param userPantry the userPantry to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userPantry, or with status {@code 400 (Bad Request)} if the userPantry has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-pantries")
    public ResponseEntity<UserPantry> createUserPantry(@RequestBody UserPantry userPantry) throws URISyntaxException {
        log.debug("REST request to save UserPantry : {}", userPantry);
        if (userPantry.getId() != null) {
            throw new BadRequestAlertException("A new userPantry cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserPantry result = userPantryRepository.save(userPantry);
        return ResponseEntity
            .created(new URI("/api/user-pantries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-pantries/:id} : Updates an existing userPantry.
     *
     * @param id the id of the userPantry to save.
     * @param userPantry the userPantry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPantry,
     * or with status {@code 400 (Bad Request)} if the userPantry is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userPantry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-pantries/{id}")
    public ResponseEntity<UserPantry> updateUserPantry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPantry userPantry
    ) throws URISyntaxException {
        log.debug("REST request to update UserPantry : {}, {}", id, userPantry);
        if (userPantry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPantry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPantryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserPantry result = userPantryRepository.save(userPantry);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userPantry.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-pantries/:id} : Partial updates given fields of an existing userPantry, field will ignore if it is null
     *
     * @param id the id of the userPantry to save.
     * @param userPantry the userPantry to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userPantry,
     * or with status {@code 400 (Bad Request)} if the userPantry is not valid,
     * or with status {@code 404 (Not Found)} if the userPantry is not found,
     * or with status {@code 500 (Internal Server Error)} if the userPantry couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-pantries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserPantry> partialUpdateUserPantry(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserPantry userPantry
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserPantry partially : {}, {}", id, userPantry);
        if (userPantry.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userPantry.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userPantryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserPantry> result = userPantryRepository
            .findById(userPantry.getId())
            .map(existingUserPantry -> {
                if (userPantry.getTimestamp() != null) {
                    existingUserPantry.setTimestamp(userPantry.getTimestamp());
                }

                return existingUserPantry;
            })
            .map(userPantryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userPantry.getId().toString())
        );
    }

    /**
     * {@code GET  /user-pantries} : get all the userPantries.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userPantries in body.
     */
    @GetMapping("/user-pantries")
    public List<UserPantry> getAllUserPantries(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all UserPantries");
        if (eagerload) {
            return userPantryRepository.findAllWithEagerRelationships();
        } else {
            return userPantryRepository.findAll();
        }
    }

    /**
     * {@code GET  /user-pantries/:id} : get the "id" userPantry.
     *
     * @param id the id of the userPantry to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userPantry, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-pantries/{id}")
    public ResponseEntity<UserPantry> getUserPantry(@PathVariable Long id) {
        log.debug("REST request to get UserPantry : {}", id);
        Optional<UserPantry> userPantry = userPantryRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(userPantry);
    }

    /**
     * {@code DELETE  /user-pantries/:id} : delete the "id" userPantry.
     *
     * @param id the id of the userPantry to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-pantries/{id}")
    public ResponseEntity<Void> deleteUserPantry(@PathVariable Long id) {
        log.debug("REST request to delete UserPantry : {}", id);
        userPantryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
