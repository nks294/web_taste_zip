package com.taste.zip.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.taste.zip.entity.MemberEntity;
import com.taste.zip.entity.NoticeEntity;
import com.taste.zip.service.NoticeService;
import com.taste.zip.vo.NoticeVO;

import lombok.AllArgsConstructor;

@Controller
@AllArgsConstructor
public class NoticeController {

    private final NoticeService boardService;
    private final HttpSession session;

    // 게시글 목록 보기
    @GetMapping("/notice")
    public ModelAndView noticeList(
            @RequestParam(value = "category", defaultValue = "all") String category,
            @RequestParam(value = "searchField", required = false) String searchField,
            @RequestParam(value = "searchWord", required = false) String searchWord,
            @RequestParam(value = "page", defaultValue = "1") int page,
            ModelAndView mav ) {
            
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        int grade = (member != null) ? member.getMemGrade() : 0;
        
        int pageSize = 10;
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        int totalCount = boardService.getBoardCount(category, searchField, searchWord);
        int totalPages = (int) Math.ceil((double) totalCount / pageSize);
        List<NoticeEntity> boardList = boardService.getBoardList(category, searchField, searchWord, pageable);
        
        mav.addObject("grade", grade);
        mav.addObject("boardList", boardList);
        mav.addObject("currentPage", page);
        mav.addObject("totalPages", totalPages);
        mav.addObject("category", category);

        mav.setViewName("board");

        return mav;
    }

    // 상세보기 페이지 요청
    @GetMapping("/notice/{id}")
    public ModelAndView view(@PathVariable("id") Long boardId, HttpSession session, ModelAndView mav) {

        // 세션에서 멤버 정보 불러오기
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        int grade = (member != null) ? member.getMemGrade() : 0;
        int memIdx = (member != null) ? member.getMemIdx() : 0;
    
        // 조회수 처리
        String clientIp = session.getId();
        String viewedKey = "viewed_" + boardId;
        String viewedIp = (String) session.getAttribute(viewedKey);
        if (viewedIp == null || !viewedIp.equals(clientIp)) {
            boardService.updateReadCount(boardId);
            session.setAttribute(viewedKey, clientIp);
        }

        System.out.println("grade: " + grade);
        System.out.println("memIdx: " + memIdx);
    
        // 게시글 조회
        NoticeEntity board = boardService.getBoard(boardId);
        if (board == null) {
            mav.setViewName("error");
            System.out.println("게시글을 찾을 수 없습니다.");
            return mav;
        }

        // 데이터와 페이지 반환
        mav.addObject("grade", grade);
        mav.addObject("memIdx", memIdx);
        mav.addObject("notice", board);
        mav.setViewName("view");
        return mav;
    }

    // 글 작성, 수정 요청
    @GetMapping("notice/write")
    public ModelAndView write(@RequestParam(value = "id", required = false) Integer boardId, HttpSession session, ModelAndView mav) {

        // 권한이 없을경우 메인페이지로 이동
        MemberEntity member = (MemberEntity) session.getAttribute("member");
        if (member == null || member.getMemGrade() != 2) {
            mav.setViewName("redirect:/");
            return mav;
        }

        System.out.println("boardId: " + boardId);
        
        // 이미 존재하는 글일 경우 수정할 수 있도록 함
        if (boardId != null) {
            NoticeEntity board = boardService.getBoard((long) boardId);
            System.out.println("detected board: " + board);
            mav.addObject("notice", board);
        }

        mav.setViewName("write");
        return mav;
    }

    @PostMapping("/notice/save")
    public String save(NoticeVO vo, HttpServletRequest request, RedirectAttributes redirectAttributes) {
        try {
            MemberEntity member = (MemberEntity) session.getAttribute("member");
    
            if (vo.getBoardId() == null) {
                NoticeEntity notice = NoticeEntity.builder()
                    .category(vo.getCategory())
                    .title(vo.getTitle())
                    .content(vo.getContent())
                    .member(member)
                    .build();
    
                boardService.insertBoard(notice);
                System.out.println("공지사항 등록 완료");
            } else {
                boardService.updateBoard(vo, request);
                System.out.println("공지사항 수정 완료");
            }
        } catch (Exception e) {
            System.out.println("공지사항 등록 중 요류 발생");
        }
        return "redirect:/notice";
    }

    @PostMapping("/notice/delete")
    public String delete(@RequestParam("id") int boardId, RedirectAttributes redirectAttributes) {
        try {
            boardService.deleteBoard(boardId);
            System.out.println("공지사항 삭제 처리 완료");
        } catch (Exception e) {
            System.out.println("게시글 삭제중 오류 발생");
        }
        return "redirect:/notice";
    }
}