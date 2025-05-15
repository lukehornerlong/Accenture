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
import org.springframework.util.Base64Utils;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.Post;
import uk.ac.bham.teamproject.repository.PostRepository;

/**
 * Integration tests for the {@link PostResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PostResourceIT {

    private static final String DEFAULT_POST_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_POST_TITLE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_POST_PIC = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_POST_PIC = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_POST_PIC_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_POST_PIC_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_POST_DESC = "AAAAAAAAAA";
    private static final String UPDATED_POST_DESC = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_LIKES = 1;
    private static final Integer UPDATED_LIKES = 2;

    private static final Integer DEFAULT_AFFORDABILITY = 1;
    private static final Integer UPDATED_AFFORDABILITY = 2;

    private static final Integer DEFAULT_SIMPLICITY = 1;
    private static final Integer UPDATED_SIMPLICITY = 2;

    private static final Integer DEFAULT_SHELF_LIFE = 1;
    private static final Integer UPDATED_SHELF_LIFE = 2;

    private static final String ENTITY_API_URL = "/api/posts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PostRepository postRepository;

    @Mock
    private PostRepository postRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPostMockMvc;

    private Post post;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Post createEntity(EntityManager em) {
        Post post = new Post()
            .postTitle(DEFAULT_POST_TITLE)
            .postPic(DEFAULT_POST_PIC)
            .postPicContentType(DEFAULT_POST_PIC_CONTENT_TYPE)
            .postDesc(DEFAULT_POST_DESC)
            .timestamp(DEFAULT_TIMESTAMP)
            .likes(DEFAULT_LIKES)
            .affordability(DEFAULT_AFFORDABILITY)
            .simplicity(DEFAULT_SIMPLICITY)
            .shelfLife(DEFAULT_SHELF_LIFE);
        return post;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Post createUpdatedEntity(EntityManager em) {
        Post post = new Post()
            .postTitle(UPDATED_POST_TITLE)
            .postPic(UPDATED_POST_PIC)
            .postPicContentType(UPDATED_POST_PIC_CONTENT_TYPE)
            .postDesc(UPDATED_POST_DESC)
            .timestamp(UPDATED_TIMESTAMP)
            .likes(UPDATED_LIKES)
            .affordability(UPDATED_AFFORDABILITY)
            .simplicity(UPDATED_SIMPLICITY)
            .shelfLife(UPDATED_SHELF_LIFE);
        return post;
    }

    @BeforeEach
    public void initTest() {
        post = createEntity(em);
    }

    @Test
    @Transactional
    void createPost() throws Exception {
        int databaseSizeBeforeCreate = postRepository.findAll().size();
        // Create the Post
        restPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(post)))
            .andExpect(status().isCreated());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeCreate + 1);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getPostTitle()).isEqualTo(DEFAULT_POST_TITLE);
        assertThat(testPost.getPostPic()).isEqualTo(DEFAULT_POST_PIC);
        assertThat(testPost.getPostPicContentType()).isEqualTo(DEFAULT_POST_PIC_CONTENT_TYPE);
        assertThat(testPost.getPostDesc()).isEqualTo(DEFAULT_POST_DESC);
        assertThat(testPost.getTimestamp()).isEqualTo(DEFAULT_TIMESTAMP);
        assertThat(testPost.getLikes()).isEqualTo(DEFAULT_LIKES);
        assertThat(testPost.getAffordability()).isEqualTo(DEFAULT_AFFORDABILITY);
        assertThat(testPost.getSimplicity()).isEqualTo(DEFAULT_SIMPLICITY);
        assertThat(testPost.getShelfLife()).isEqualTo(DEFAULT_SHELF_LIFE);
    }

    @Test
    @Transactional
    void createPostWithExistingId() throws Exception {
        // Create the Post with an existing ID
        post.setId(1L);

        int databaseSizeBeforeCreate = postRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPostMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(post)))
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPosts() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get all the postList
        restPostMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(post.getId().intValue())))
            .andExpect(jsonPath("$.[*].postTitle").value(hasItem(DEFAULT_POST_TITLE)))
            .andExpect(jsonPath("$.[*].postPicContentType").value(hasItem(DEFAULT_POST_PIC_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].postPic").value(hasItem(Base64Utils.encodeToString(DEFAULT_POST_PIC))))
            .andExpect(jsonPath("$.[*].postDesc").value(hasItem(DEFAULT_POST_DESC)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())))
            .andExpect(jsonPath("$.[*].likes").value(hasItem(DEFAULT_LIKES)))
            .andExpect(jsonPath("$.[*].affordability").value(hasItem(DEFAULT_AFFORDABILITY)))
            .andExpect(jsonPath("$.[*].simplicity").value(hasItem(DEFAULT_SIMPLICITY)))
            .andExpect(jsonPath("$.[*].shelfLife").value(hasItem(DEFAULT_SHELF_LIFE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPostsWithEagerRelationshipsIsEnabled() throws Exception {
        when(postRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPostMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(postRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPostsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(postRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPostMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(postRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPost() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        // Get the post
        restPostMockMvc
            .perform(get(ENTITY_API_URL_ID, post.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(post.getId().intValue()))
            .andExpect(jsonPath("$.postTitle").value(DEFAULT_POST_TITLE))
            .andExpect(jsonPath("$.postPicContentType").value(DEFAULT_POST_PIC_CONTENT_TYPE))
            .andExpect(jsonPath("$.postPic").value(Base64Utils.encodeToString(DEFAULT_POST_PIC)))
            .andExpect(jsonPath("$.postDesc").value(DEFAULT_POST_DESC))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()))
            .andExpect(jsonPath("$.likes").value(DEFAULT_LIKES))
            .andExpect(jsonPath("$.affordability").value(DEFAULT_AFFORDABILITY))
            .andExpect(jsonPath("$.simplicity").value(DEFAULT_SIMPLICITY))
            .andExpect(jsonPath("$.shelfLife").value(DEFAULT_SHELF_LIFE));
    }

    @Test
    @Transactional
    void getNonExistingPost() throws Exception {
        // Get the post
        restPostMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPost() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeUpdate = postRepository.findAll().size();

        // Update the post
        Post updatedPost = postRepository.findById(post.getId()).get();
        // Disconnect from session so that the updates on updatedPost are not directly saved in db
        em.detach(updatedPost);
        updatedPost
            .postTitle(UPDATED_POST_TITLE)
            .postPic(UPDATED_POST_PIC)
            .postPicContentType(UPDATED_POST_PIC_CONTENT_TYPE)
            .postDesc(UPDATED_POST_DESC)
            .timestamp(UPDATED_TIMESTAMP)
            .likes(UPDATED_LIKES)
            .affordability(UPDATED_AFFORDABILITY)
            .simplicity(UPDATED_SIMPLICITY)
            .shelfLife(UPDATED_SHELF_LIFE);

        restPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPost.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPost))
            )
            .andExpect(status().isOk());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getPostTitle()).isEqualTo(UPDATED_POST_TITLE);
        assertThat(testPost.getPostPic()).isEqualTo(UPDATED_POST_PIC);
        assertThat(testPost.getPostPicContentType()).isEqualTo(UPDATED_POST_PIC_CONTENT_TYPE);
        assertThat(testPost.getPostDesc()).isEqualTo(UPDATED_POST_DESC);
        assertThat(testPost.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testPost.getLikes()).isEqualTo(UPDATED_LIKES);
        assertThat(testPost.getAffordability()).isEqualTo(UPDATED_AFFORDABILITY);
        assertThat(testPost.getSimplicity()).isEqualTo(UPDATED_SIMPLICITY);
        assertThat(testPost.getShelfLife()).isEqualTo(UPDATED_SHELF_LIFE);
    }

    @Test
    @Transactional
    void putNonExistingPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, post.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(post))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(post))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(post)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePostWithPatch() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeUpdate = postRepository.findAll().size();

        // Update the post using partial update
        Post partialUpdatedPost = new Post();
        partialUpdatedPost.setId(post.getId());

        partialUpdatedPost
            .timestamp(UPDATED_TIMESTAMP)
            .affordability(UPDATED_AFFORDABILITY)
            .simplicity(UPDATED_SIMPLICITY)
            .shelfLife(UPDATED_SHELF_LIFE);

        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPost))
            )
            .andExpect(status().isOk());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getPostTitle()).isEqualTo(DEFAULT_POST_TITLE);
        assertThat(testPost.getPostPic()).isEqualTo(DEFAULT_POST_PIC);
        assertThat(testPost.getPostPicContentType()).isEqualTo(DEFAULT_POST_PIC_CONTENT_TYPE);
        assertThat(testPost.getPostDesc()).isEqualTo(DEFAULT_POST_DESC);
        assertThat(testPost.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testPost.getLikes()).isEqualTo(DEFAULT_LIKES);
        assertThat(testPost.getAffordability()).isEqualTo(UPDATED_AFFORDABILITY);
        assertThat(testPost.getSimplicity()).isEqualTo(UPDATED_SIMPLICITY);
        assertThat(testPost.getShelfLife()).isEqualTo(UPDATED_SHELF_LIFE);
    }

    @Test
    @Transactional
    void fullUpdatePostWithPatch() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeUpdate = postRepository.findAll().size();

        // Update the post using partial update
        Post partialUpdatedPost = new Post();
        partialUpdatedPost.setId(post.getId());

        partialUpdatedPost
            .postTitle(UPDATED_POST_TITLE)
            .postPic(UPDATED_POST_PIC)
            .postPicContentType(UPDATED_POST_PIC_CONTENT_TYPE)
            .postDesc(UPDATED_POST_DESC)
            .timestamp(UPDATED_TIMESTAMP)
            .likes(UPDATED_LIKES)
            .affordability(UPDATED_AFFORDABILITY)
            .simplicity(UPDATED_SIMPLICITY)
            .shelfLife(UPDATED_SHELF_LIFE);

        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPost.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPost))
            )
            .andExpect(status().isOk());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
        Post testPost = postList.get(postList.size() - 1);
        assertThat(testPost.getPostTitle()).isEqualTo(UPDATED_POST_TITLE);
        assertThat(testPost.getPostPic()).isEqualTo(UPDATED_POST_PIC);
        assertThat(testPost.getPostPicContentType()).isEqualTo(UPDATED_POST_PIC_CONTENT_TYPE);
        assertThat(testPost.getPostDesc()).isEqualTo(UPDATED_POST_DESC);
        assertThat(testPost.getTimestamp()).isEqualTo(UPDATED_TIMESTAMP);
        assertThat(testPost.getLikes()).isEqualTo(UPDATED_LIKES);
        assertThat(testPost.getAffordability()).isEqualTo(UPDATED_AFFORDABILITY);
        assertThat(testPost.getSimplicity()).isEqualTo(UPDATED_SIMPLICITY);
        assertThat(testPost.getShelfLife()).isEqualTo(UPDATED_SHELF_LIFE);
    }

    @Test
    @Transactional
    void patchNonExistingPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, post.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(post))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(post))
            )
            .andExpect(status().isBadRequest());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPost() throws Exception {
        int databaseSizeBeforeUpdate = postRepository.findAll().size();
        post.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPostMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(post)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Post in the database
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePost() throws Exception {
        // Initialize the database
        postRepository.saveAndFlush(post);

        int databaseSizeBeforeDelete = postRepository.findAll().size();

        // Delete the post
        restPostMockMvc
            .perform(delete(ENTITY_API_URL_ID, post.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Post> postList = postRepository.findAll();
        assertThat(postList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
