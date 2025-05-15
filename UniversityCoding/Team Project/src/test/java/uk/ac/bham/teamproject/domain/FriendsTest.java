package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class FriendsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Friends.class);
        Friends friends1 = new Friends();
        friends1.setId(1L);
        Friends friends2 = new Friends();
        friends2.setId(friends1.getId());
        assertThat(friends1).isEqualTo(friends2);
        friends2.setId(2L);
        assertThat(friends1).isNotEqualTo(friends2);
        friends1.setId(null);
        assertThat(friends1).isNotEqualTo(friends2);
    }
}
