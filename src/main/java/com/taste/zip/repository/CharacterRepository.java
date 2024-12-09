package com.taste.zip.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.taste.zip.entity.CharacterEntity;

@Repository
public interface CharacterRepository extends JpaRepository<CharacterEntity, Long> {
    
    @Query(value = "SELECT * FROM characters ORDER BY RAND() LIMIT 1", nativeQuery = true)
    CharacterEntity findRandomCharacter();

    @Query(value = "SELECT * FROM characters", nativeQuery = true)
    List<CharacterEntity> getCharacterList();

}





