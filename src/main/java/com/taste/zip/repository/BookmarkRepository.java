package com.taste.zip.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taste.zip.entity.BookmarkEntity;
import com.taste.zip.entity.MemberEntity;
import com.taste.zip.entity.PlaceEntity;

@Repository
public interface BookmarkRepository extends JpaRepository<BookmarkEntity, Long> {
    boolean existsByMemberAndPlace(MemberEntity member, PlaceEntity place);
    Optional<BookmarkEntity> findByMemberAndPlace(MemberEntity member, PlaceEntity place);
    List<BookmarkEntity> findByMember(MemberEntity member);
}
