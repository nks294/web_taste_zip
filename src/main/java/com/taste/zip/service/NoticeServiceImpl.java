package com.taste.zip.service;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taste.zip.entity.NoticeEntity;
import com.taste.zip.repository.NoticeRepository;
import com.taste.zip.vo.NoticeVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository boardRepository;

    @Override
    public List<NoticeEntity> getBoardList(String category, String searchField, String searchWord, Pageable pageable) {
        return boardRepository.getBoardList(category, searchField, searchWord, pageable);
    }

    @Override
    public NoticeEntity getBoard(Long boardId) {
        return boardRepository.getBoard(boardId);
    }

    @Override
    public int getBoardCount(String category, String searchField, String searchWord) {
        return boardRepository.getBoardCount(category, searchField, searchWord);
    }

    @Override
    public void insertBoard(NoticeEntity notice) {
        boardRepository.save(notice);
    }

    @Override
    @Transactional
    public void updateReadCount(Long boardId) {
        boardRepository.updateReadCount(boardId);
    }

    @Override
    public void updateBoard(NoticeVO vo, HttpServletRequest request) {
        Optional<NoticeEntity> optionalBoard = boardRepository.findById((long) vo.getBoardId());
        if (optionalBoard.isPresent()) {
            NoticeEntity entity = NoticeEntity.builder()
            .title(vo.getTitle())
            .content(vo.getContent())
            .category(vo.getCategory())
            .build();

            boardRepository.save(entity);
        } else {
            throw new RuntimeException("수정할 게시글을 찾을 수 없습니다. ID: " + vo.getBoardId());
        }
    }

    @Override
    public void deleteBoard(int boardId) {
        Optional<NoticeEntity> optionalBoard = boardRepository.findById((long) boardId);
        if (optionalBoard.isPresent()) {
            NoticeEntity boardEntity = optionalBoard.get();
            boardEntity.updateStatus(0);
            boardRepository.save(boardEntity);
        } else {
            throw new RuntimeException("삭제할 게시글을 찾을 수 없습니다. ID: " + boardId);
        }
    }

    // private NoticeVO toBoardVO(NoticeEntity entity) {
    //     NoticeVO vo = new NoticeVO();
    //     vo.setBoardId(entity.getBoardId());
    //     vo.setTitle(entity.getTitle());
    //     vo.setContent(entity.getContent());
    //     vo.setCategory(entity.getCategory());
    //     vo.setReadCnt(entity.getReadCnt());
    //     vo.setCreatedDate(entity.getCreatedDate());
    //     vo.setModifiedDate(entity.getModifiedDate());
    //     vo.setStatus(entity.getStatus() == 1 ? 1 : 0);
    //     vo.setMemberName(entity.getMember().getMemberName()); // MemberEntity에서 작성자 이름 가져오기
    //     return vo;
    // }

    // private NoticeEntity toBoardEntity(NoticeVO vo) {
    //     NoticeEntity entity = NoticeEntity.builder()
    //         .title(vo.getTitle())
    //         .content(vo.getContent())
    //         .category(vo.getCategory())
    //         .build();
        
    //     // entity.setTitle(vo.getTitle());
    //     // entity.setContent(vo.getContent());
    //     // entity.setCategory(vo.getCategory());
    //     entity.updateReadCnt(vo.getReadCnt());
    //     entity.updateStatus(vo.getStatus());
    //     return entity;
    // }
}
