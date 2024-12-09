package com.taste.zip.service;

import java.util.List;

import com.taste.zip.entity.MemberCharacterEntity;
import com.taste.zip.vo.CharacterResponseVO;

public interface CharacterService {

    MemberCharacterEntity getRandomCharacter(int memIdx);

    List<CharacterResponseVO> getCharactersByMemIdx(int memIdx);

    List<CharacterResponseVO> getAllCharacters();

    void addPoints(int memIdx, int points);

}




