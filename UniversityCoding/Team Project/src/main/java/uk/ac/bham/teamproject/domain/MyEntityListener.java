package uk.ac.bham.teamproject.domain;

import javax.persistence.PostLoad;
import javax.persistence.PrePersist;

public class MyEntityListener {

    @PostLoad
    public void setDefaultValue(Post entity) {
        if (entity.getLikes() == null) {
            entity.setLikes(0);
        }
    }

    @PrePersist
    public void setDefaultValueIfNull(Post entity) {
        if (entity.getLikes() == null) {
            entity.setLikes(0);
        }
    }
}
