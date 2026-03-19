#!/bin/bash
BRAIN_DIR="/Users/yosinuri/.gemini/antigravity/brain/8c60c1f2-5999-4ece-ab29-ff05aa3f0f82"
TARGET_DIR="images/services"

mkdir -p "$TARGET_DIR"

cp "$BRAIN_DIR"/concrete_patio_service_1773864900483.png "$TARGET_DIR"/concrete_patio.png
cp "$BRAIN_DIR"/custom_driveway_service_1773864916697.png "$TARGET_DIR"/custom_driveway.png
cp "$BRAIN_DIR"/retaining_wall_service_1773864882726.png "$TARGET_DIR"/retaining_wall.png
cp "$BRAIN_DIR"/turf_installation_service_1773864839953.png "$TARGET_DIR"/turf_installation.png
cp "$BRAIN_DIR"/hardscaping_stones_service_1773864868672.png "$TARGET_DIR"/hardscaping.png
cp "$BRAIN_DIR"/wooden_pergola_service_1773864929934.png "$TARGET_DIR"/pergola_installation.png
cp "$BRAIN_DIR"/stone_pathway_service_1773864947111.png "$TARGET_DIR"/walkways.png
cp "$BRAIN_DIR"/landscape_flowers_service_1773864824235.png "$TARGET_DIR"/flower_beds.png
cp "$BRAIN_DIR"/landscape_lighting_service_1773864852511.png "$TARGET_DIR"/outdoor_lighting.png
echo "All custom AI-generated service images copied successfully."
