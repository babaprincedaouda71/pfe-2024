package org.example.clientservice.service;

import org.example.clientservice.entity.Color;
import org.example.clientservice.repo.ColorRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ColorServiceImpl implements ColorService {
  private final ColorRepo colorRepo;

  public ColorServiceImpl(ColorRepo colorRepo) {
    this.colorRepo = colorRepo;
  }

  @Override
  public List<Color> getAllColors() {
    return colorRepo.findAll();
  }

  @Override
  public Color getColor(Long color) {
    return colorRepo.findById(color).get();
  }

  @Override
  public Color saveColor(Color color) {
    return colorRepo.save(color);
  }

  @Override
  public Color deleteColor(Long color) {
    Color color1 = getColor(color);
    colorRepo.deleteById(color);
    return color1;
  }
}
