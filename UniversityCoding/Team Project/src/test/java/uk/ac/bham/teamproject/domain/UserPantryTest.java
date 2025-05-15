package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class UserPantryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserPantry.class);
        UserPantry userPantry1 = new UserPantry();
        userPantry1.setId(1L);
        UserPantry userPantry2 = new UserPantry();
        userPantry2.setId(userPantry1.getId());
        assertThat(userPantry1).isEqualTo(userPantry2);
        userPantry2.setId(2L);
        assertThat(userPantry1).isNotEqualTo(userPantry2);
        userPantry1.setId(null);
        assertThat(userPantry1).isNotEqualTo(userPantry2);
    }
}
