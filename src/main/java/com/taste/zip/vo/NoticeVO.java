package com.taste.zip.vo;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class NoticeVO {
	private Long boardId;
	private String memberName;
	private String category;
	private String title;
	private String content;
	private int readCnt;
	private Date createdDate;
	private Date modifiedDate;
	private int status;
}
