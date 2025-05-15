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
import uk.ac.bham.teamproject.domain.Friends;
import uk.ac.bham.teamproject.repository.FriendsRepository;

/**
 * Integration tests for the {@link FriendsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FriendsResourceIT {

    private static final String ENTITY_API_URL = "/api/friends";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FriendsRepository friendsRepository;

    @Mock
    private FriendsRepository friendsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFriendsMockMvc;

    private Friends friends;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Friends createEntity(EntityManager em) {
        Friends friends = new Friends();
        return friends;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Friends createUpdatedEntity(EntityManager em) {
        Friends friends = new Friends();
        return friends;
    }

    @BeforeEach
    public void initTest() {
        friends = createEntity(em);
    }

    @Test
    @Transactional
    void createFriends() throws Exception {
        int databaseSizeBeforeCreate = friendsRepository.findAll().size();
        // Create the Friends
        restFriendsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(friends)))
            .andExpect(status().isCreated());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeCreate + 1);
        Friends testFriends = friendsList.get(friendsList.size() - 1);
    }

    @Test
    @Transactional
    void createFriendsWithExistingId() throws Exception {
        // Create the Friends with an existing ID
        friends.setId(1L);

        int databaseSizeBeforeCreate = friendsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFriendsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(friends)))
            .andExpect(status().isBadRequest());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFriends() throws Exception {
        // Initialize the database
        friendsRepository.saveAndFlush(friends);

        // Get all the friendsList
        restFriendsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(friends.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFriendsWithEagerRelationshipsIsEnabled() throws Exception {
        when(friendsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFriendsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(friendsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFriendsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(friendsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFriendsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(friendsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getFriends() throws Exception {
        // Initialize the database
        friendsRepository.saveAndFlush(friends);

        // Get the friends
        restFriendsMockMvc
            .perform(get(ENTITY_API_URL_ID, friends.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(friends.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingFriends() throws Exception {
        // Get the friends
        restFriendsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFriends() throws Exception {
        // Initialize the database
        friendsRepository.saveAndFlush(friends);

        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();

        // Update the friends
        Friends updatedFriends = friendsRepository.findById(friends.getId()).get();
        // Disconnect from session so that the updates on updatedFriends are not directly saved in db
        em.detach(updatedFriends);

        restFriendsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFriends.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFriends))
            )
            .andExpect(status().isOk());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
        Friends testFriends = friendsList.get(friendsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingFriends() throws Exception {
        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();
        friends.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFriendsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, friends.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friends))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFriends() throws Exception {
        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();
        friends.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(friends))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFriends() throws Exception {
        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();
        friends.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(friends)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFriendsWithPatch() throws Exception {
        // Initialize the database
        friendsRepository.saveAndFlush(friends);

        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();

        // Update the friends using partial update
        Friends partialUpdatedFriends = new Friends();
        partialUpdatedFriends.setId(friends.getId());

        restFriendsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFriends.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFriends))
            )
            .andExpect(status().isOk());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
        Friends testFriends = friendsList.get(friendsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateFriendsWithPatch() throws Exception {
        // Initialize the database
        friendsRepository.saveAndFlush(friends);

        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();

        // Update the friends using partial update
        Friends partialUpdatedFriends = new Friends();
        partialUpdatedFriends.setId(friends.getId());

        restFriendsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFriends.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFriends))
            )
            .andExpect(status().isOk());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
        Friends testFriends = friendsList.get(friendsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingFriends() throws Exception {
        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();
        friends.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFriendsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, friends.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friends))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFriends() throws Exception {
        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();
        friends.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(friends))
            )
            .andExpect(status().isBadRequest());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFriends() throws Exception {
        int databaseSizeBeforeUpdate = friendsRepository.findAll().size();
        friends.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFriendsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(friends)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Friends in the database
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFriends() throws Exception {
        // Initialize the database
        friendsRepository.saveAndFlush(friends);

        int databaseSizeBeforeDelete = friendsRepository.findAll().size();

        // Delete the friends
        restFriendsMockMvc
            .perform(delete(ENTITY_API_URL_ID, friends.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Friends> friendsList = friendsRepository.findAll();
        assertThat(friendsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
