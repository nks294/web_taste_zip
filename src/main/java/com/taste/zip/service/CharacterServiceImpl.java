package com.taste.zip.service;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.taste.zip.entity.CharacterEntity;
import com.taste.zip.entity.MemberCharacterEntity;
import com.taste.zip.entity.MemberEntity;
import com.taste.zip.repository.CharacterRepository;
import com.taste.zip.repository.MemberCharacterRepository;
import com.taste.zip.repository.MemberRepository;
import com.taste.zip.vo.CharacterResponseVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CharacterServiceImpl implements CharacterService {
    private final CharacterRepository characterRepository;
    private final MemberCharacterRepository memberCharacterRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public MemberCharacterEntity getRandomCharacter(int memIdx) {
        // Get member entity
        MemberEntity member = memberRepository.findById(memIdx)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        // Check if member has enough points
        if (member.getPoint() < 10) {
            throw new RuntimeException("Not enough points. Required: 10, Current: " + member.getPoint());
        }

        // Deduct points
        member.setPoint(member.getPoint() - 10);
        memberRepository.save(member);

        // Get random character and create member-character relationship
        CharacterEntity randomCharacter = characterRepository.findRandomCharacter();

        MemberCharacterEntity memberCharacter = new MemberCharacterEntity();
        memberCharacter.setMemIdx(memIdx);
        memberCharacter.setCharacter(randomCharacter);

        return memberCharacterRepository.save(memberCharacter);
    }

    @Override
    public List<CharacterResponseVO> getCharactersByMemIdx(int memIdx) {
        List<MemberCharacterEntity> entities = memberCharacterRepository.findByMemIdx(memIdx);
        return entities.stream().map(entity -> {
            CharacterResponseVO vo = new CharacterResponseVO();
            vo.setCharacterId(entity.getCharacter().getCharacterId());
            vo.setCharacterName(entity.getCharacter().getCharacterName());
            vo.setCharacterImage(entity.getCharacter().getCharacterImage());
            vo.setProfileImage(entity.isProfileImage());
            vo.setObtainedDate(entity.getObtainedDate().toString());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public List<CharacterResponseVO> getAllCharacters() {
        List<CharacterEntity> entities = characterRepository.getCharacterList();
        return entities.stream().map(entity -> {
            CharacterResponseVO vo = new CharacterResponseVO();
            vo.setCharacterId(entity.getCharacterId());
            vo.setCharacterName(entity.getCharacterName());
            vo.setCharacterImage(entity.getCharacterImage());
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addPoints(int memIdx, int points) {
        MemberEntity member = memberRepository.findById(memIdx)
                .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        member.setPoint(member.getPoint() + points);
        memberRepository.save(member);
    }
    
}
