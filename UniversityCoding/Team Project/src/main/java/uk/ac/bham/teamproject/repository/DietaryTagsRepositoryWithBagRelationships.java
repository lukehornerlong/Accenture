package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.DietaryTags;

public interface DietaryTagsRepositoryWithBagRelationships {
    Optional<DietaryTags> fetchBagRelationships(Optional<DietaryTags> dietaryTags);

    List<DietaryTags> fetchBagRelationships(List<DietaryTags> dietaryTags);

    Page<DietaryTags> fetchBagRelationships(Page<DietaryTags> dietaryTags);
}
