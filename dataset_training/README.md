# PathoAI Dataset Training Directory

This directory is designated for storing pathology and clinical dermatology dataset files (e.g., HAM10000, ISIC 2019/2020, DermNet) used for training, fine-tuning, or evaluating machine learning models.

---

## 📂 Directory Layout

```
dataset_training/
├── train/                  # Training set images categorized by class folder or raw images
│   ├── melanoma/
│   ├── basal_cell_carcinoma/
│   ├── nevus/
│   ├── benign_keratosis/
│   └── squamous_cell_carcinoma/
├── val/                    # Validation dataset
├── test/                   # Test dataset for accuracy benchmark
├── labels.csv              # CSV mapping (image_id, dx, dx_type, age, sex, localization)
└── README.md
```

---

## 🏷️ Supported Pathology Classes

1. **Melanoma (`mel`)**: Malignant skin cancer
2. **Basal Cell Carcinoma (`bcc`)**: Common malignant skin lesion
3. **Actinic Keratosis (`akiec`)**: Pre-malignant lesion
4. **Benign Keratosis (`bkl`)**: Solar lentigo / seborrheic keratosis
5. **Dermatofibroma (`df`)**: Benign skin lesion
6. **Vascular Lesion (`vasc`)**: Cherry angioma / angiokeratoma
7. **Melanocytic Nevus (`nv`)**: Common mole

---

## 🚀 How to Load and Train

Place raw skin/pathology images inside the respective class subfolders or upload `labels.csv` to train custom vision backbones (e.g., EfficientNet, ResNet50, or Gemini multimodal embeddings).
