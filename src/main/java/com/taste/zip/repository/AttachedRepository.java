package com.taste.zip.repository;

import com.taste.zip.entity.AttachedEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AttachedRepository extends JpaRepository<AttachedEntity, Long> {

    // 첨부파일 등록은 JpaRepository의 save 메서드를 활용

    @Query("select a from AttachedEntity a where a.board.boardId = :boardId")
    List<AttachedEntity> findAllByBoardId(@Param("boardId") Long boardId);

    @Modifying
    @Query("delete from AttachedEntity a where a.attachmentId = :attachmentId")
    void deleteAttachment(@Param("attachmentId") Long attachmentId);
}
