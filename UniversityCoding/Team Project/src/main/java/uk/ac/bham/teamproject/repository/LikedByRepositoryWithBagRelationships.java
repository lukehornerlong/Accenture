package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.LikedBy;

public interface LikedByRepositoryWithBagRelationships {
    Optional<LikedBy> fetchBagRelationships(Optional<LikedBy> likedBy);

    List<LikedBy> fetchBagRelationships(List<LikedBy> likedBies);

    Page<LikedBy> fetchBagRelationships(Page<LikedBy> likedBies);
}
