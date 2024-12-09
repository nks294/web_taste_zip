package com.taste.zip.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SearchPageVO {

	// 검색기능 관련 필드
	private String searchField; // 검색영역
	private String searchWord; // 검색어

	// 페이징 관련 필드
	private int pageNum; // 현재 페이지 번호
	private int blockNum; // 현재 블록 번호
	private int startNum; // 게시글 시작 번호

}
