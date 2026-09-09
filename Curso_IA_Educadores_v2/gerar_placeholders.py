# -*- coding: utf-8 -*-
"""Gera imagens em branco (placeholders) para o curso.
Cada arquivo tem o nome final. Basta substituir pelo arquivo real gerado."""
from PIL import Image, ImageDraw
import os

PASTA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "imagens")
os.makedirs(PASTA, exist_ok=True)

INDIGO = (79, 70, 229)
LILAS = (238, 240, 254)
CINZA = (148, 163, 184)

# (nome do arquivo, formato)  |  Q = quadrada 1024, W = larga 1280x720
IMAGENS = [
    # ---- CAPA E ABERTURA ----
    ("capa_professores_ia.png", "W"),
    # ---- ENCONTRO 1 ----
    ("01_whatsapp_teclado_previsao.png", "Q"),
    ("02_formula_ptcf_esquema.png", "Q"),
    ("03_dois_barcos_estrategia.png", "Q"),
    ("04_primeiro_acesso_tela.png", "Q"),
    ("05_alucinacao_ia_metafora.png", "Q"),
    # ---- ENCONTRO 2 ----
    ("06_organizacao_rotina_professor.png", "Q"),
    ("07_pareceres_pilha_fichas.png", "Q"),
    ("08_bncc_codigo_explicado.png", "Q"),
    ("09_notebooklm_documentos.png", "Q"),
    ("10_planejamento_sequencia.png", "Q"),
    # ---- ENCONTRO 3 ----
    ("11_materiais_didaticos_coloridos.png", "Q"),
    ("12_inclusao_escolar_sala.png", "Q"),
    ("13_dua_multiplos_caminhos.png", "Q"),
    ("14_tres_niveis_diferenciacao.png", "Q"),
    ("15_canva_educacao_design.png", "Q"),
    # ---- ENCONTRO 4 ----
    ("16_avaliacao_rubrica.png", "Q"),
    ("17_seguranca_lgpd_escola.png", "Q"),
    ("18_anonimizacao_dados.png", "Q"),
    ("19_projeto_intervencao_final.png", "Q"),
    ("20_professor_insubstituivel.png", "Q"),
    # ---- ESTUDOS DE CASO ----
    ("caso_1_aula_amanha.png", "Q"),
    ("caso_2_pareceres_segunda.png", "Q"),
    ("caso_3_turma_quatro_necessidades.png", "Q"),
    ("caso_4_parecer_sigiloso.png", "Q"),
]


def criar(nome, formato):
    w, h = (1280, 720) if formato == "W" else (1024, 1024)
    img = Image.new("RGB", (w, h), (255, 255, 255))
    d = ImageDraw.Draw(img)
    # moldura tracejada discreta, só para identificar que é placeholder
    m = 12
    passo = 26
    for x in range(m, w - m, passo):
        d.line([(x, m), (min(x + 13, w - m), m)], fill=CINZA, width=3)
        d.line([(x, h - m), (min(x + 13, w - m), h - m)], fill=CINZA, width=3)
    for y in range(m, h - m, passo):
        d.line([(m, y), (m, min(y + 13, h - m))], fill=CINZA, width=3)
        d.line([(w - m, y), (w - m, min(y + 13, h - m))], fill=CINZA, width=3)
    # faixa central lilás com o nome do arquivo
    fh = 116
    d.rectangle([m + 8, h // 2 - fh // 2, w - m - 8, h // 2 + fh // 2], fill=LILAS)
    txt = nome
    try:
        bbox = d.textbbox((0, 0), txt)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
    except Exception:
        tw, th = len(txt) * 6, 11
    d.text(((w - tw) / 2, (h - th) / 2 - 16), txt, fill=INDIGO)
    d.text(((w - tw) / 2, (h - th) / 2 + 6), f"[{w}x{h}] substituir por imagem final",
           fill=CINZA)
    img.save(os.path.join(PASTA, nome))
    return nome


if __name__ == "__main__":
    for nome, fmt in IMAGENS:
        criar(nome, fmt)
    print(f"{len(IMAGENS)} placeholders criados em: {PASTA}")
