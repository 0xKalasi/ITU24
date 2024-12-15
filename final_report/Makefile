.PHONY: all clean

LOGIN = xlogin00
# PRED ODEVZDANIM SI NASTAVTE VLASTNI LOGIN !!!

SRC = 02_final.tex
OUT = 02_$(LOGIN)_final
BUILD_DIR = build

all: $(OUT)

$(OUT): $(SRC) clean
	@mkdir -p $(BUILD_DIR)
	pdflatex --output-directory=$(BUILD_DIR) --jobname=$(OUT) $(SRC)
	pdflatex --output-directory=$(BUILD_DIR) --jobname=$(OUT) $(SRC)
	@mv $(BUILD_DIR)/$(OUT).pdf ./
# Two compilation runs to handle references

clean:
	rm -rf $(BUILD_DIR) 02_*.pdf
