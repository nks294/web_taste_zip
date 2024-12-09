package com.taste.zip.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class AttachedVO {

    private Long attachmentId; 
    private Long boardId;      
    private String fileName;   
    private String fileUrl;    
    private String fileType;   
    private String uploadedDate; 
}
