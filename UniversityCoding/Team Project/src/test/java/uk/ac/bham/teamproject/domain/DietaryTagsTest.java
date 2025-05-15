package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class DietaryTagsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DietaryTags.class);
        DietaryTags dietaryTags1 = new DietaryTags();
        dietaryTags1.setId(1L);
        DietaryTags dietaryTags2 = new DietaryTags();
        dietaryTags2.setId(dietaryTags1.getId());
        assertThat(dietaryTags1).isEqualTo(dietaryTags2);
        dietaryTags2.setId(2L);
        assertThat(dietaryTags1).isNotEqualTo(dietaryTags2);
        dietaryTags1.setId(null);
        assertThat(dietaryTags1).isNotEqualTo(dietaryTags2);
    }
}
