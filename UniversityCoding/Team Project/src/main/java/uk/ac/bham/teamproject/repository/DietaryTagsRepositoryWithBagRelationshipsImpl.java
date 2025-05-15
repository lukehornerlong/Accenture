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
import uk.ac.bham.teamproject.domain.DietaryTags;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class DietaryTagsRepositoryWithBagRelationshipsImpl implements DietaryTagsRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<DietaryTags> fetchBagRelationships(Optional<DietaryTags> dietaryTags) {
        return dietaryTags.map(this::fetchPosts);
    }

    @Override
    public Page<DietaryTags> fetchBagRelationships(Page<DietaryTags> dietaryTags) {
        return new PageImpl<>(fetchBagRelationships(dietaryTags.getContent()), dietaryTags.getPageable(), dietaryTags.getTotalElements());
    }

    @Override
    public List<DietaryTags> fetchBagRelationships(List<DietaryTags> dietaryTags) {
        return Optional.of(dietaryTags).map(this::fetchPosts).orElse(Collections.emptyList());
    }

    DietaryTags fetchPosts(DietaryTags result) {
        return entityManager
            .createQuery(
                "select dietaryTags from DietaryTags dietaryTags left join fetch dietaryTags.posts where dietaryTags is :dietaryTags",
                DietaryTags.class
            )
            .setParameter("dietaryTags", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<DietaryTags> fetchPosts(List<DietaryTags> dietaryTags) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, dietaryTags.size()).forEach(index -> order.put(dietaryTags.get(index).getId(), index));
        List<DietaryTags> result = entityManager
            .createQuery(
                "select distinct dietaryTags from DietaryTags dietaryTags left join fetch dietaryTags.posts where dietaryTags in :dietaryTags",
                DietaryTags.class
            )
            .setParameter("dietaryTags", dietaryTags)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
