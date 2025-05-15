package uk.ac.bham.teamproject.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import uk.ac.bham.teamproject.domain.LikedBy;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class LikedByRepositoryWithBagRelationshipsImpl implements LikedByRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<LikedBy> fetchBagRelationships(Optional<LikedBy> likedBy) {
        return likedBy.map(this::fetchUsers);
    }

    @Override
    public Page<LikedBy> fetchBagRelationships(Page<LikedBy> likedBies) {
        return new PageImpl<>(fetchBagRelationships(likedBies.getContent()), likedBies.getPageable(), likedBies.getTotalElements());
    }

    @Override
    public List<LikedBy> fetchBagRelationships(List<LikedBy> likedBies) {
        return Optional.of(likedBies).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    LikedBy fetchUsers(LikedBy result) {
        return entityManager
            .createQuery("select likedBy from LikedBy likedBy left join fetch likedBy.users where likedBy is :likedBy", LikedBy.class)
            .setParameter("likedBy", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<LikedBy> fetchUsers(List<LikedBy> likedBies) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, likedBies.size()).forEach(index -> order.put(likedBies.get(index).getId(), index));
        List<LikedBy> result = entityManager
            .createQuery(
                "select distinct likedBy from LikedBy likedBy left join fetch likedBy.users where likedBy in :likedBies",
                LikedBy.class
            )
            .setParameter("likedBies", likedBies)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
