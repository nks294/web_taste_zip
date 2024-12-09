package com.taste.zip.service;

import com.taste.zip.entity.AttachedEntity;
import com.taste.zip.repository.AttachedRepository;
import com.taste.zip.vo.AttachedVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachedServiceImpl implements AttachedService {

    private final AttachedRepository attachedRepository;

    @Override
    public List<AttachedVO> getAttachmentsByBoardId(Long boardId) {
        List<AttachedEntity> entities = attachedRepository.findAllByBoardId(boardId);
        return entities.stream()
                .map(this::toVO)
                .collect(Collectors.toList());
    }

    @Override
    public void saveAttachment(AttachedVO attachedVO) {
        AttachedEntity entity = toEntity(attachedVO);
        attachedRepository.save(entity);
    }

    @Override
    public void deleteAttachment(Long attachmentId) {
        attachedRepository.deleteAttachment(attachmentId);
    }
    
    private AttachedVO toVO(AttachedEntity entity) {
        AttachedVO vo = new AttachedVO();
        vo.setAttachmentId(entity.getAttachmentId());
        vo.setBoardId(entity.getBoard().getBoardId());
        vo.setFileName(entity.getFileName());
        vo.setFileUrl(entity.getFileUrl());
        vo.setFileType(entity.getFileType());
        vo.setUploadedDate(entity.getUploadedDate().toString());
        return vo;
    }

    private AttachedEntity toEntity(AttachedVO vo) {
        AttachedEntity entity = new AttachedEntity();
        entity.setFileName(vo.getFileName());
        entity.setFileUrl(vo.getFileUrl());
        entity.setFileType(vo.getFileType());
        return entity;
    }
}
