package org.example.clientservice.web;

import org.example.clientservice.entity.Color;
import org.example.clientservice.service.ColorService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/color")
public class ColorController {
  private final ColorService colorService;

  public ColorController(ColorService colorService) {
    this.colorService = colorService;
  }

  @GetMapping("/find/all")
  @PreAuthorize("hasAuthority('admin')")
  public List<Color> findAll() {
    return colorService.getAllColors();
  }

  @GetMapping("/find/id/{id}")
  @PreAuthorize("hasAuthority('admin')")
  public Color find(@PathVariable Long id) {
    return colorService.getColor(id);
  }

  @PostMapping("/add")
  @PreAuthorize("hasAuthority('admin')")
  public Color add(@RequestBody Color color) {
    return colorService.saveColor(color);
  }

  @DeleteMapping("/delete/{id}")
  @PreAuthorize("hasAuthority('admin')")
  public Color delete(@PathVariable Long id) {
    return colorService.deleteColor(id);
  }
}
