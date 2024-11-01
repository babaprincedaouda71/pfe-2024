package org.example.clientservice.service;

import org.example.clientservice.entity.Color;

import java.util.List;

public interface ColorService {
  List<Color> getAllColors();

  Color getColor(Long color);

  Color saveColor(Color color);

  Color deleteColor(Long color);
}
