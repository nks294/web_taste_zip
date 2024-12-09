package com.taste.zip.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.taste.zip.entity.MemberCharacterEntity;

@Repository
public interface MemberCharacterRepository extends JpaRepository<MemberCharacterEntity, Long> {
    @Query("SELECT mc FROM MemberCharacterEntity mc JOIN FETCH mc.character WHERE mc.memIdx = :memIdx")
    List<MemberCharacterEntity> findByMemIdx(@Param("memIdx") int memIdx);
}







