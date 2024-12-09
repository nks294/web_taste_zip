package com.taste.zip.service;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Pageable;

import com.taste.zip.entity.NoticeEntity;
import com.taste.zip.vo.NoticeVO;

public interface NoticeService {

    List<NoticeEntity> getBoardList(String category, String searchField, String searchWord, Pageable pageable);

    NoticeEntity getBoard(Long boardId);

    int getBoardCount(String category, String searchField, String searchWord);

    void insertBoard(NoticeEntity notice);

    void updateBoard(NoticeVO vo, HttpServletRequest request);

    void updateReadCount(Long boardId);

    void deleteBoard(int bIdx);
}
