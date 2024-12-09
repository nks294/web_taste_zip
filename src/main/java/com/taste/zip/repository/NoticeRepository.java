package com.taste.zip.repository;

import com.taste.zip.entity.NoticeEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<NoticeEntity, Long> {

    // 게시글 목록 조회
    @Query("select b from NoticeEntity b join b.member m " +
           "where b.status = 1 " +
           "and (:category = 'all' or b.category = :category) " +
           "and (:searchWord is null or :searchWord = '' " +
           "   or (:searchField = 'title' and b.title like concat('%', :searchWord, '%')) " +
           "   or (:searchField = 'writer' and m.memberName like concat('%', :searchWord, '%')) " +
           "   or (:searchField = 'content' and b.content like concat('%', :searchWord, '%'))) ")
    List<NoticeEntity> getBoardList(
         @Param("category") String category,
         @Param("searchField") String searchField,
         @Param("searchWord") String searchWord,
         Pageable pageable
    );

    // 게시글 조회
    @Query("select b from NoticeEntity b join fetch b.member where b.boardId = :boardId")
    NoticeEntity getBoard(@Param("boardId") Long boardId);

    // 게시글 개수 조회
    @Query("select count(b) from NoticeEntity b join b.member m " +
           "where b.status = 1 " +
           "and (:category = 'all' or b.category = :category) " +
           "and (:searchWord is null or :searchWord = '' " +
           "   or (:searchField = 'title' and b.title like concat('%', :searchWord, '%')) " +
           "   or (:searchField = 'writer' and m.memberName like concat('%', :searchWord, '%')) " +
           "   or (:searchField = 'content' and b.content like concat('%', :searchWord, '%'))) ")
    int getBoardCount(
        @Param("category") String category,
        @Param("searchField") String searchField,
        @Param("searchWord") String searchWord
    );

    // 게시글 최대 번호 조회
    @Query("select max(b.boardId) from NoticeEntity b")
    Optional<Long> findMaxBoardId();

    // 조회수 증가
    @Modifying
    @Query("update NoticeEntity b set b.readCnt = b.readCnt + 1 where b.boardId = :boardId")
    void updateReadCount(@Param("boardId") Long boardId);

    // 게시글 수정
    @Modifying
    @Query("update NoticeEntity b set b.title = :title, b.content = :content, " +
           "b.category = :category, b.modifiedDate = current_timestamp " +
           "where b.boardId = :boardId")
    void updateBoard(
        @Param("boardId") Long boardId,
        @Param("title") String title,
        @Param("content") String content,
        @Param("category") String category
    );

    // 게시글 삭제
    @Modifying
    @Query("update NoticeEntity b set b.status = 0, b.modifiedDate = current_timestamp " +
           "where b.boardId = :boardId")
    void deleteBoard(@Param("boardId") Long boardId);
}
