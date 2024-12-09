package com.taste.zip.service;

import com.taste.zip.vo.AttachedVO;

import java.util.List;

public interface AttachedService {

    List<AttachedVO> getAttachmentsByBoardId(Long boardId);
    
    void saveAttachment(AttachedVO attachedVO);

    void deleteAttachment(Long attachmentId);
}
