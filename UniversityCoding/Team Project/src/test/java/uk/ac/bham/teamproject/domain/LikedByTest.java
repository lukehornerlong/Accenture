package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class LikedByTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LikedBy.class);
        LikedBy likedBy1 = new LikedBy();
        likedBy1.setId(1L);
        LikedBy likedBy2 = new LikedBy();
        likedBy2.setId(likedBy1.getId());
        assertThat(likedBy1).isEqualTo(likedBy2);
        likedBy2.setId(2L);
        assertThat(likedBy1).isNotEqualTo(likedBy2);
        likedBy1.setId(null);
        assertThat(likedBy1).isNotEqualTo(likedBy2);
    }
}
