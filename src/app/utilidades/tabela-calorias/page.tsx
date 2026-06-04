'use client';

import { useState, useMemo } from 'react';

interface Alimento {
  id: number;
  nome: string;
  categoria: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  fibra: number;
}

const alimentos: Alimento[] = [
  { id: 1, nome: 'Arroz branco cozido', categoria: 'Cereais', calorias: 128, proteinas: 2.5, carboidratos: 28.1, gorduras: 0.1, fibra: 1.6 },
  { id: 2, nome: 'Arroz integral cozido', categoria: 'Cereais', calorias: 124, proteinas: 2.6, carboidratos: 25.8, gorduras: 1.0, fibra: 2.7 },
  { id: 3, nome: 'Feijão preto cozido', categoria: 'Cereais', calorias: 77, proteinas: 4.5, carboidratos: 14.0, gorduras: 0.3, fibra: 8.4 },
  { id: 4, nome: 'Feijão carioca cozido', categoria: 'Cereais', calorias: 76, proteinas: 4.8, carboidratos: 13.6, gorduras: 0.5, fibra: 8.5 },
  { id: 5, nome: 'Macarrão cozido', categoria: 'Cereais', calorias: 131, proteinas: 4.4, carboidratos: 25.4, gorduras: 1.3, fibra: 1.8 },
  { id: 6, nome: 'Pão francês', categoria: 'Cereais', calorias: 274, proteinas: 8.4, carboidratos: 55.2, gorduras: 1.6, fibra: 2.3 },
  { id: 7, nome: 'Pão integral', categoria: 'Cereais', calorias: 253, proteinas: 9.2, carboidratos: 43.1, gorduras: 3.4, fibra: 6.0 },
  { id: 8, nome: 'Pão de forma', categoria: 'Cereais', calorias: 258, proteinas: 8.0, carboidratos: 49.0, gorduras: 2.5, fibra: 2.7 },
  { id: 9, nome: 'Aveia', categoria: 'Cereais', calorias: 394, proteinas: 13.9, carboidratos: 66.6, gorduras: 8.5, fibra: 9.1 },
  { id: 10, nome: 'Granola', categoria: 'Cereais', calorias: 471, proteinas: 10.5, carboidratos: 53.0, gorduras: 24.0, fibra: 5.0 },
  { id: 11, nome: 'Batata cozida', categoria: 'Cereais', calorias: 69, proteinas: 1.4, carboidratos: 15.8, gorduras: 0.1, fibra: 2.2 },
  { id: 12, nome: 'Batata frita', categoria: 'Cereais', calorias: 312, proteinas: 3.4, carboidratos: 36.6, gorduras: 17.1, fibra: 3.8 },
  { id: 13, nome: 'Mandioca (aipim) cozida', categoria: 'Cereais', calorias: 125, proteinas: 0.6, carboidratos: 30.1, gorduras: 0.2, fibra: 1.6 },
  { id: 14, nome: 'Farinha de mandioca', categoria: 'Cereais', calorias: 361, proteinas: 1.6, carboidratos: 87.9, gorduras: 0.3, fibra: 6.4 },
  { id: 15, nome: 'Milho cozido', categoria: 'Cereais', calorias: 98, proteinas: 3.3, carboidratos: 19.0, gorduras: 1.2, fibra: 2.4 },
  { id: 16, nome: 'Pipoca (sem manteiga)', categoria: 'Cereais', calorias: 387, proteinas: 12.9, carboidratos: 77.9, gorduras: 4.5, fibra: 14.5 },
  { id: 17, nome: 'Tapioca', categoria: 'Cereais', calorias: 358, proteinas: 0.6, carboidratos: 88.7, gorduras: 0.1, fibra: 0.9 },
  { id: 18, nome: 'Cuscuz de milho', categoria: 'Cereais', calorias: 113, proteinas: 2.7, carboidratos: 24.3, gorduras: 0.2, fibra: 1.5 },
  { id: 19, nome: 'Frango grelhado (peito)', categoria: 'Carnes', calorias: 163, proteinas: 31.5, carboidratos: 0, gorduras: 3.2, fibra: 0 },
  { id: 20, nome: 'Frango frito', categoria: 'Carnes', calorias: 246, proteinas: 24.1, carboidratos: 7.1, gorduras: 13.6, fibra: 0.3 },
  { id: 21, nome: 'Coxa de frango assada', categoria: 'Carnes', calorias: 209, proteinas: 27.3, carboidratos: 0, gorduras: 10.5, fibra: 0 },
  { id: 22, nome: 'Carne bovina (patinho) grelhada', categoria: 'Carnes', calorias: 219, proteinas: 32.4, carboidratos: 0, gorduras: 9.0, fibra: 0 },
  { id: 23, nome: 'Carne bovina (alcatra) grelhada', categoria: 'Carnes', calorias: 241, proteinas: 31.0, carboidratos: 0, gorduras: 12.5, fibra: 0 },
  { id: 24, nome: 'Carne bovina (picanha) grelhada', categoria: 'Carnes', calorias: 280, proteinas: 28.0, carboidratos: 0, gorduras: 18.0, fibra: 0 },
  { id: 25, nome: 'Carne moída refogada', categoria: 'Carnes', calorias: 215, proteinas: 26.1, carboidratos: 1.2, gorduras: 11.4, fibra: 0 },
  { id: 26, nome: 'Bife acebolado', categoria: 'Carnes', calorias: 232, proteinas: 28.5, carboidratos: 3.8, gorduras: 11.2, fibra: 0.5 },
  { id: 27, nome: 'Costela bovina assada', categoria: 'Carnes', calorias: 330, proteinas: 25.0, carboidratos: 0, gorduras: 25.0, fibra: 0 },
  { id: 28, nome: 'Linguiça calabresa', categoria: 'Carnes', calorias: 277, proteinas: 16.2, carboidratos: 2.5, gorduras: 22.4, fibra: 0 },
  { id: 29, nome: 'Salsicha', categoria: 'Carnes', calorias: 278, proteinas: 10.3, carboidratos: 4.6, gorduras: 24.5, fibra: 0 },
  { id: 30, nome: 'Presunto', categoria: 'Carnes', calorias: 130, proteinas: 16.3, carboidratos: 1.5, gorduras: 6.2, fibra: 0 },
  { id: 31, nome: 'Mortadela', categoria: 'Carnes', calorias: 269, proteinas: 12.0, carboidratos: 5.8, gorduras: 21.6, fibra: 0 },
  { id: 32, nome: 'Bacon', categoria: 'Carnes', calorias: 556, proteinas: 11.6, carboidratos: 1.4, gorduras: 55.6, fibra: 0 },
  { id: 33, nome: 'Peixe (tilápia) grelhado', categoria: 'Carnes', calorias: 128, proteinas: 26.2, carboidratos: 0, gorduras: 2.0, fibra: 0 },
  { id: 34, nome: 'Salmão grelhado', categoria: 'Carnes', calorias: 208, proteinas: 20.4, carboidratos: 0, gorduras: 13.4, fibra: 0 },
  { id: 35, nome: 'Sardinha enlatada', categoria: 'Carnes', calorias: 208, proteinas: 24.6, carboidratos: 0, gorduras: 11.5, fibra: 0 },
  { id: 36, nome: 'Atum enlatado', categoria: 'Carnes', calorias: 116, proteinas: 26.0, carboidratos: 0, gorduras: 0.8, fibra: 0 },
  { id: 37, nome: 'Camarão cozido', categoria: 'Carnes', calorias: 99, proteinas: 21.0, carboidratos: 0.5, gorduras: 1.0, fibra: 0 },
  { id: 38, nome: 'Ovo de galinha cozido', categoria: 'Carnes', calorias: 155, proteinas: 13.0, carboidratos: 1.1, gorduras: 10.6, fibra: 0 },
  { id: 39, nome: 'Ovo de galinha frito', categoria: 'Carnes', calorias: 196, proteinas: 13.6, carboidratos: 1.0, gorduras: 15.3, fibra: 0 },
  { id: 40, nome: 'Omelete', categoria: 'Carnes', calorias: 154, proteinas: 11.1, carboidratos: 1.5, gorduras: 11.4, fibra: 0 },
  { id: 41, nome: 'Banana nanica', categoria: 'Frutas', calorias: 92, proteinas: 1.3, carboidratos: 23.8, gorduras: 0.1, fibra: 1.9 },
  { id: 42, nome: 'Banana prata', categoria: 'Frutas', calorias: 98, proteinas: 1.3, carboidratos: 26.0, gorduras: 0.1, fibra: 2.0 },
  { id: 43, nome: 'Maçã', categoria: 'Frutas', calorias: 56, proteinas: 0.3, carboidratos: 14.8, gorduras: 0.1, fibra: 2.0 },
  { id: 44, nome: 'Laranja', categoria: 'Frutas', calorias: 46, proteinas: 0.9, carboidratos: 11.5, gorduras: 0.1, fibra: 2.4 },
  { id: 45, nome: 'Mamão', categoria: 'Frutas', calorias: 40, proteinas: 0.5, carboidratos: 10.4, gorduras: 0.1, fibra: 1.0 },
  { id: 46, nome: 'Melancia', categoria: 'Frutas', calorias: 33, proteinas: 0.7, carboidratos: 8.1, gorduras: 0.1, fibra: 0.4 },
  { id: 47, nome: 'Melão', categoria: 'Frutas', calorias: 31, proteinas: 0.7, carboidratos: 7.9, gorduras: 0.1, fibra: 0.8 },
  { id: 48, nome: 'Abacaxi', categoria: 'Frutas', calorias: 48, proteinas: 0.5, carboidratos: 12.3, gorduras: 0.1, fibra: 1.4 },
  { id: 49, nome: 'Uva', categoria: 'Frutas', calorias: 61, proteinas: 0.6, carboidratos: 16.0, gorduras: 0.2, fibra: 0.9 },
  { id: 50, nome: 'Morango', categoria: 'Frutas', calorias: 33, proteinas: 0.6, carboidratos: 7.7, gorduras: 0.2, fibra: 1.7 },
  { id: 51, nome: 'Manga', categoria: 'Frutas', calorias: 65, proteinas: 0.5, carboidratos: 17.0, gorduras: 0.2, fibra: 1.8 },
  { id: 52, nome: 'Pera', categoria: 'Frutas', calorias: 53, proteinas: 0.4, carboidratos: 14.0, gorduras: 0.1, fibra: 3.6 },
  { id: 53, nome: 'Pêssego', categoria: 'Frutas', calorias: 39, proteinas: 0.9, carboidratos: 9.5, gorduras: 0.1, fibra: 2.2 },
  { id: 54, nome: 'Abacate', categoria: 'Frutas', calorias: 96, proteinas: 1.2, carboidratos: 6.0, gorduras: 8.4, fibra: 6.3 },
  { id: 55, nome: 'Kiwi', categoria: 'Frutas', calorias: 51, proteinas: 1.0, carboidratos: 11.5, gorduras: 0.5, fibra: 2.7 },
  { id: 56, nome: 'Limão', categoria: 'Frutas', calorias: 22, proteinas: 0.4, carboidratos: 7.0, gorduras: 0.1, fibra: 1.5 },
  { id: 57, nome: 'Maracujá', categoria: 'Frutas', calorias: 68, proteinas: 1.5, carboidratos: 12.3, gorduras: 2.1, fibra: 10.4 },
  { id: 58, nome: 'Goiaba', categoria: 'Frutas', calorias: 54, proteinas: 1.1, carboidratos: 13.0, gorduras: 0.4, fibra: 6.2 },
  { id: 59, nome: 'Jaca', categoria: 'Frutas', calorias: 88, proteinas: 1.4, carboidratos: 22.5, gorduras: 0.1, fibra: 1.5 },
  { id: 60, nome: 'Açaí (polpa)', categoria: 'Frutas', calorias: 70, proteinas: 1.0, carboidratos: 6.0, gorduras: 5.0, fibra: 3.0 },
  { id: 61, nome: 'Leite integral', categoria: 'Laticínios', calorias: 61, proteinas: 3.2, carboidratos: 4.6, gorduras: 3.3, fibra: 0 },
  { id: 62, nome: 'Leite desnatado', categoria: 'Laticínios', calorias: 38, proteinas: 3.4, carboidratos: 5.1, gorduras: 0.1, fibra: 0 },
  { id: 63, nome: 'Iogurte natural', categoria: 'Laticínios', calorias: 61, proteinas: 4.1, carboidratos: 5.8, gorduras: 2.2, fibra: 0 },
  { id: 64, nome: 'Iogurte com frutas', categoria: 'Laticínios', calorias: 95, proteinas: 3.5, carboidratos: 15.0, gorduras: 2.5, fibra: 0 },
  { id: 65, nome: 'Queijo mussarela', categoria: 'Laticínios', calorias: 300, proteinas: 22.0, carboidratos: 3.0, gorduras: 22.5, fibra: 0 },
  { id: 66, nome: 'Queijo prato', categoria: 'Laticínios', calorias: 360, proteinas: 22.0, carboidratos: 2.0, gorduras: 29.5, fibra: 0 },
  { id: 67, nome: 'Queijo minas', categoria: 'Laticínios', calorias: 264, proteinas: 17.4, carboidratos: 3.2, gorduras: 20.6, fibra: 0 },
  { id: 68, nome: 'Queijo parmesão', categoria: 'Laticínios', calorias: 431, proteinas: 38.5, carboidratos: 3.7, gorduras: 28.6, fibra: 0 },
  { id: 69, nome: 'Queijo cottage', categoria: 'Laticínios', calorias: 98, proteinas: 11.1, carboidratos: 4.3, gorduras: 4.3, fibra: 0 },
  { id: 70, nome: 'Requeijão cremoso', categoria: 'Laticínios', calorias: 257, proteinas: 9.0, carboidratos: 3.5, gorduras: 23.0, fibra: 0 },
  { id: 71, nome: 'Manteiga', categoria: 'Laticínios', calorias: 726, proteinas: 0.9, carboidratos: 0.1, gorduras: 81.0, fibra: 0 },
  { id: 72, nome: 'Creme de leite', categoria: 'Laticínios', calorias: 221, proteinas: 2.0, carboidratos: 3.5, gorduras: 22.5, fibra: 0 },
  { id: 73, nome: 'Leite condensado', categoria: 'Laticínios', calorias: 321, proteinas: 7.7, carboidratos: 54.4, gorduras: 8.7, fibra: 0 },
  { id: 74, nome: 'Achocolatado em pó', categoria: 'Laticínios', calorias: 401, proteinas: 6.0, carboidratos: 77.0, gorduras: 8.0, fibra: 4.0 },
  { id: 75, nome: 'Whey protein', categoria: 'Laticínios', calorias: 380, proteinas: 75.0, carboidratos: 8.0, gorduras: 4.0, fibra: 0 },
  { id: 76, nome: 'Alface', categoria: 'Legumes', calorias: 15, proteinas: 1.4, carboidratos: 2.9, gorduras: 0.2, fibra: 2.0 },
  { id: 77, nome: 'Tomate', categoria: 'Legumes', calorias: 19, proteinas: 1.0, carboidratos: 4.0, gorduras: 0.2, fibra: 1.4 },
  { id: 78, nome: 'Cebola', categoria: 'Legumes', calorias: 40, proteinas: 1.1, carboidratos: 9.3, gorduras: 0.1, fibra: 1.7 },
  { id: 79, nome: 'Alho', categoria: 'Legumes', calorias: 113, proteinas: 6.4, carboidratos: 23.9, gorduras: 0.2, fibra: 2.1 },
  { id: 80, nome: 'Cenoura', categoria: 'Legumes', calorias: 34, proteinas: 1.1, carboidratos: 7.7, gorduras: 0.2, fibra: 3.0 },
  { id: 81, nome: 'Batata-doce', categoria: 'Legumes', calorias: 118, proteinas: 1.3, carboidratos: 28.2, gorduras: 0.1, fibra: 2.5 },
  { id: 82, nome: 'Abobrinha', categoria: 'Legumes', calorias: 19, proteinas: 1.5, carboidratos: 3.8, gorduras: 0.1, fibra: 1.2 },
  { id: 83, nome: 'Berinjela', categoria: 'Legumes', calorias: 25, proteinas: 1.0, carboidratos: 5.9, gorduras: 0.1, fibra: 3.4 },
  { id: 84, nome: 'Pimentão', categoria: 'Legumes', calorias: 28, proteinas: 1.0, carboidratos: 6.4, gorduras: 0.2, fibra: 1.7 },
  { id: 85, nome: 'Brócolis', categoria: 'Legumes', calorias: 25, proteinas: 3.0, carboidratos: 4.4, gorduras: 0.4, fibra: 3.0 },
  { id: 86, nome: 'Couve-flor', categoria: 'Legumes', calorias: 23, proteinas: 2.1, carboidratos: 4.5, gorduras: 0.1, fibra: 2.5 },
  { id: 87, nome: 'Espinafre', categoria: 'Legumes', calorias: 23, proteinas: 2.9, carboidratos: 3.6, gorduras: 0.4, fibra: 2.2 },
  { id: 88, nome: 'Repolho', categoria: 'Legumes', calorias: 27, proteinas: 1.4, carboidratos: 6.0, gorduras: 0.1, fibra: 2.3 },
  { id: 89, nome: 'Chuchu', categoria: 'Legumes', calorias: 19, proteinas: 0.7, carboidratos: 4.5, gorduras: 0.1, fibra: 1.3 },
  { id: 90, nome: 'Pepino', categoria: 'Legumes', calorias: 13, proteinas: 0.6, carboidratos: 2.9, gorduras: 0.1, fibra: 0.7 },
  { id: 91, nome: 'Beterraba', categoria: 'Legumes', calorias: 43, proteinas: 1.6, carboidratos: 9.6, gorduras: 0.1, fibra: 2.8 },
  { id: 92, nome: 'Abóbora', categoria: 'Legumes', calorias: 40, proteinas: 1.0, carboidratos: 10.0, gorduras: 0.1, fibra: 2.0 },
  { id: 93, nome: 'Vagem', categoria: 'Legumes', calorias: 31, proteinas: 1.9, carboidratos: 7.0, gorduras: 0.1, fibra: 3.4 },
  { id: 94, nome: 'Ervilha', categoria: 'Legumes', calorias: 75, proteinas: 5.0, carboidratos: 13.0, gorduras: 0.3, fibra: 5.1 },
  { id: 95, nome: 'Milho verde (lata)', categoria: 'Legumes', calorias: 88, proteinas: 2.4, carboidratos: 18.7, gorduras: 1.2, fibra: 2.0 },
  { id: 96, nome: 'Palmito', categoria: 'Legumes', calorias: 29, proteinas: 2.5, carboidratos: 5.5, gorduras: 0.2, fibra: 3.5 },
  { id: 97, nome: 'Cogchampignon', categoria: 'Legumes', calorias: 25, proteinas: 2.5, carboidratos: 3.3, gorduras: 0.4, fibra: 1.0 },
  { id: 98, nome: 'Soja (grão)', categoria: 'Legumes', calorias: 403, proteinas: 36.5, carboidratos: 30.0, gorduras: 18.5, fibra: 15.5 },
  { id: 99, nome: 'Tofu', categoria: 'Legumes', calorias: 76, proteinas: 8.1, carboidratos: 1.9, gorduras: 4.8, fibra: 0.3 },
  { id: 100, nome: 'Suco de laranja natural', categoria: 'Bebidas', calorias: 42, proteinas: 0.7, carboidratos: 9.6, gorduras: 0.2, fibra: 0.2 },
  { id: 101, nome: 'Suco de uva', categoria: 'Bebidas', calorias: 58, proteinas: 0.4, carboidratos: 14.2, gorduras: 0.1, fibra: 0.1 },
  { id: 102, nome: 'Suco de maracujá', categoria: 'Bebidas', calorias: 52, proteinas: 0.5, carboidratos: 12.0, gorduras: 0.2, fibra: 0.5 },
  { id: 103, nome: 'Refrigerante (cola)', categoria: 'Bebidas', calorias: 41, proteinas: 0, carboidratos: 10.6, gorduras: 0, fibra: 0 },
  { id: 104, nome: 'Refrigerante (guaraná)', categoria: 'Bebidas', calorias: 39, proteinas: 0, carboidratos: 10.0, gorduras: 0, fibra: 0 },
  { id: 105, nome: 'Cerveja', categoria: 'Bebidas', calorias: 41, proteinas: 0.5, carboidratos: 3.0, gorduras: 0, fibra: 0 },
  { id: 106, nome: 'Vinho tinto', categoria: 'Bebidas', calorias: 72, proteinas: 0.1, carboidratos: 1.5, gorduras: 0, fibra: 0 },
  { id: 107, nome: 'Café (sem açúcar)', categoria: 'Bebidas', calorias: 2, proteinas: 0.1, carboidratos: 0, gorduras: 0, fibra: 0 },
  { id: 108, nome: 'Chá (sem açúcar)', categoria: 'Bebidas', calorias: 1, proteinas: 0, carboidratos: 0.3, gorduras: 0, fibra: 0 },
  { id: 109, nome: 'Água de coco', categoria: 'Bebidas', calorias: 19, proteinas: 0.2, carboidratos: 4.6, gorduras: 0.1, fibra: 0.1 },
  { id: 110, nome: 'Achocolatado líquido', categoria: 'Bebidas', calorias: 68, proteinas: 2.0, carboidratos: 12.0, gorduras: 1.5, fibra: 0 },
  { id: 111, nome: 'Energético', categoria: 'Bebidas', calorias: 45, proteinas: 0.4, carboidratos: 11.0, gorduras: 0, fibra: 0 },
  { id: 112, nome: 'Vodka', categoria: 'Bebidas', calorias: 231, proteinas: 0, carboidratos: 0, gorduras: 0, fibra: 0 },
  { id: 113, nome: 'Caipirinha', categoria: 'Bebidas', calorias: 162, proteinas: 0.1, carboidratos: 12.0, gorduras: 0, fibra: 0.1 },
  { id: 114, nome: 'Azeite de oliva', categoria: 'Gorduras', calorias: 884, proteinas: 0, carboidratos: 0, gorduras: 100.0, fibra: 0 },
  { id: 115, nome: 'Óleo de soja', categoria: 'Gorduras', calorias: 884, proteinas: 0, carboidratos: 0, gorduras: 100.0, fibra: 0 },
  { id: 116, nome: 'Margarina', categoria: 'Gorduras', calorias: 717, proteinas: 0.2, carboidratos: 0.5, gorduras: 80.0, fibra: 0 },
  { id: 117, nome: 'Maionese', categoria: 'Gorduras', calorias: 691, proteinas: 1.0, carboidratos: 3.0, gorduras: 74.0, fibra: 0 },
  { id: 118, nome: 'Açúcar', categoria: 'Outros', calorias: 387, proteinas: 0, carboidratos: 99.9, gorduras: 0, fibra: 0 },
  { id: 119, nome: 'Mel', categoria: 'Outros', calorias: 309, proteinas: 0.3, carboidratos: 82.4, gorduras: 0, fibra: 0.2 },
  { id: 120, nome: 'Chocolate ao leite', categoria: 'Outros', calorias: 535, proteinas: 7.0, carboidratos: 58.0, gorduras: 30.0, fibra: 2.0 },
  { id: 121, nome: 'Chocolate amargo', categoria: 'Outros', calorias: 479, proteinas: 7.5, carboidratos: 46.0, gorduras: 30.0, fibra: 7.0 },
  { id: 122, nome: 'Sorvete', categoria: 'Outros', calorias: 207, proteinas: 3.5, carboidratos: 24.0, gorduras: 11.0, fibra: 0.5 },
  { id: 123, nome: 'Bolo de chocolate', categoria: 'Outros', calorias: 380, proteinas: 5.0, carboidratos: 50.0, gorduras: 18.0, fibra: 2.0 },
  { id: 124, nome: 'Bolo de fubá', categoria: 'Outros', calorias: 340, proteinas: 5.5, carboidratos: 52.0, gorduras: 12.0, fibra: 1.0 },
  { id: 125, nome: 'Brigadeiro', categoria: 'Outros', calorias: 410, proteinas: 4.0, carboidratos: 60.0, gorduras: 18.0, fibra: 1.0 },
  { id: 126, nome: 'Pastel (massa)', categoria: 'Outros', calorias: 280, proteinas: 5.0, carboidratos: 35.0, gorduras: 13.0, fibra: 1.5 },
  { id: 127, nome: 'Coxinha', categoria: 'Outros', calorias: 260, proteinas: 8.0, carboidratos: 28.0, gorduras: 13.0, fibra: 1.0 },
  { id: 128, nome: 'Empada', categoria: 'Outros', calorias: 310, proteinas: 6.0, carboidratos: 32.0, gorduras: 18.0, fibra: 1.0 },
  { id: 129, nome: 'Pizza (margherita)', categoria: 'Outros', calorias: 250, proteinas: 10.0, carboidratos: 30.0, gorduras: 10.0, fibra: 2.0 },
  { id: 130, nome: 'Hambúrguer', categoria: 'Outros', calorias: 295, proteinas: 17.0, carboidratos: 24.0, gorduras: 14.0, fibra: 1.0 },
  { id: 131, nome: 'Hot dog', categoria: 'Outros', calorias: 290, proteinas: 10.0, carboidratos: 24.0, gorduras: 18.0, fibra: 1.0 },
  { id: 132, nome: 'Lasanha', categoria: 'Outros', calorias: 135, proteinas: 8.0, carboidratos: 15.0, gorduras: 5.0, fibra: 1.0 },
  { id: 133, nome: 'Nhoque', categoria: 'Outros', calorias: 130, proteinas: 3.0, carboidratos: 25.0, gorduras: 1.5, fibra: 1.5 },
  { id: 134, nome: 'Esfiha', categoria: 'Outros', calorias: 230, proteinas: 10.0, carboidratos: 28.0, gorduras: 9.0, fibra: 1.5 },
  { id: 135, nome: 'Pão de queijo', categoria: 'Outros', calorias: 320, proteinas: 6.0, carboidratos: 38.0, gorduras: 16.0, fibra: 1.0 },
  { id: 136, nome: 'Tapioca recheada (queijo)', categoria: 'Outros', calorias: 220, proteinas: 8.0, carboidratos: 30.0, gorduras: 8.0, fibra: 0.5 },
  { id: 137, nome: 'Açaí na tigela', categoria: 'Outros', calorias: 250, proteinas: 3.0, carboidratos: 40.0, gorduras: 10.0, fibra: 4.0 },
  { id: 138, nome: 'Pão de alho', categoria: 'Outros', calorias: 350, proteinas: 7.0, carboidratos: 40.0, gorduras: 18.0, fibra: 1.5 },
  { id: 139, nome: 'Cuscuz com ovo', categoria: 'Outros', calorias: 180, proteinas: 8.0, carboidratos: 25.0, gorduras: 5.0, fibra: 1.5 },
  { id: 140, nome: 'Mingau de aveia', categoria: 'Outros', calorias: 120, proteinas: 4.0, carboidratos: 20.0, gorduras: 3.0, fibra: 2.5 },
  { id: 141, nome: 'Vitamina de banana', categoria: 'Outros', calorias: 150, proteinas: 4.0, carboidratos: 28.0, gorduras: 3.0, fibra: 2.0 },
  { id: 142, nome: 'Milk shake', categoria: 'Outros', calorias: 200, proteinas: 5.0, carboidratos: 30.0, gorduras: 7.0, fibra: 0.5 },
  { id: 143, nome: 'Pipoca com manteiga', categoria: 'Outros', calorias: 420, proteinas: 12.0, carboidratos: 55.0, gorduras: 18.0, fibra: 10.0 },
  { id: 144, nome: 'Amendoim', categoria: 'Outros', calorias: 567, proteinas: 25.8, carboidratos: 16.1, gorduras: 49.2, fibra: 8.5 },
  { id: 145, nome: 'Castanha de caju', categoria: 'Outros', calorias: 553, proteinas: 18.2, carboidratos: 30.2, gorduras: 43.9, fibra: 3.3 },
  { id: 146, nome: 'Castanha do Pará', categoria: 'Outros', calorias: 656, proteinas: 14.3, carboidratos: 12.3, gorduras: 66.4, fibra: 7.5 },
  { id: 147, nome: 'Nozes', categoria: 'Outros', calorias: 654, proteinas: 15.2, carboidratos: 13.7, gorduras: 65.2, fibra: 6.7 },
  { id: 148, nome: 'Azeitona', categoria: 'Outros', calorias: 115, proteinas: 0.8, carboidratos: 6.3, gorduras: 10.7, fibra: 3.2 },
  { id: 149, nome: 'Ketchup', categoria: 'Outros', calorias: 101, proteinas: 1.2, carboidratos: 25.0, gorduras: 0.1, fibra: 0.3 },
  { id: 150, nome: 'Mostarda', categoria: 'Outros', calorias: 66, proteinas: 3.7, carboidratos: 5.8, gorduras: 3.3, fibra: 0.8 },
  { id: 151, nome: 'Shoyu', categoria: 'Outros', calorias: 53, proteinas: 8.1, carboidratos: 4.9, gorduras: 0, fibra: 0.8 },
  { id: 152, nome: 'Vinagre', categoria: 'Outros', calorias: 18, proteinas: 0, carboidratos: 0.6, gorduras: 0, fibra: 0 },
  { id: 153, nome: 'Sal', categoria: 'Outros', calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibra: 0 },
  { id: 154, nome: 'Farinha de trigo', categoria: 'Cereais', calorias: 364, proteinas: 10.0, carboidratos: 75.0, gorduras: 1.0, fibra: 2.4 },
  { id: 155, nome: 'Farinha de arroz', categoria: 'Cereais', calorias: 366, proteinas: 6.0, carboidratos: 80.0, gorduras: 0.5, fibra: 1.5 },
  { id: 156, nome: 'Fermento biológico', categoria: 'Outros', calorias: 83, proteinas: 12.0, carboidratos: 10.0, gorduras: 0.5, fibra: 6.5 },
  { id: 157, nome: 'Gelatina (pó)', categoria: 'Outros', calorias: 335, proteinas: 85.0, carboidratos: 0, gorduras: 0, fibra: 0 },
  { id: 158, nome: 'Leite em pó', categoria: 'Laticínios', calorias: 496, proteinas: 26.0, carboidratos: 38.0, gorduras: 26.0, fibra: 0 },
  { id: 159, nome: 'Nescau', categoria: 'Outros', calorias: 380, proteinas: 5.0, carboidratos: 80.0, gorduras: 3.0, fibra: 4.0 },
  { id: 160, nome: 'Café em pó', categoria: 'Bebidas', calorias: 223, proteinas: 12.0, carboidratos: 40.0, gorduras: 0.5, fibra: 0 },
  { id: 161, nome: 'Chá mate', categoria: 'Bebidas', calorias: 1, proteinas: 0, carboidratos: 0.2, gorduras: 0, fibra: 0 },
  { id: 162, nome: 'Isotônico', categoria: 'Bebidas', calorias: 26, proteinas: 0, carboidratos: 6.5, gorduras: 0, fibra: 0 },
  { id: 163, nome: 'Suco de acerola', categoria: 'Bebidas', calorias: 23, proteinas: 0.4, carboidratos: 5.5, gorduras: 0.1, fibra: 0.5 },
  { id: 164, nome: 'Suco de goiaba', categoria: 'Bebidas', calorias: 52, proteinas: 0.5, carboidratos: 12.5, gorduras: 0.2, fibra: 0.5 },
  { id: 165, nome: 'Creme de avelã', categoria: 'Outros', calorias: 539, proteinas: 6.0, carboidratos: 57.0, gorduras: 31.0, fibra: 4.0 },
  { id: 166, nome: 'Granulado', categoria: 'Outros', calorias: 380, proteinas: 2.0, carboidratos: 90.0, gorduras: 1.0, fibra: 0 },
  { id: 167, nome: 'Doce de leite', categoria: 'Outros', calorias: 315, proteinas: 6.0, carboidratos: 55.0, gorduras: 7.0, fibra: 0 },
  { id: 168, nome: 'Goiabada', categoria: 'Outros', calorias: 300, proteinas: 0.5, carboidratos: 75.0, gorduras: 0.1, fibra: 1.5 },
  { id: 169, nome: 'Paçoca', categoria: 'Outros', calorias: 480, proteinas: 15.0, carboidratos: 50.0, gorduras: 25.0, fibra: 3.0 },
  { id: 170, nome: 'Pé-de-moleque', categoria: 'Outros', calorias: 450, proteinas: 10.0, carboidratos: 55.0, gorduras: 22.0, fibra: 2.0 },
  { id: 171, nome: 'Romeu e Julieta', categoria: 'Outros', calorias: 280, proteinas: 6.0, carboidratos: 40.0, gorduras: 10.0, fibra: 0.5 },
  { id: 172, nome: 'Pudim de leite', categoria: 'Outros', calorias: 220, proteinas: 5.0, carboidratos: 35.0, gorduras: 7.0, fibra: 0 },
  { id: 173, nome: 'Mousse de maracujá', categoria: 'Outros', calorias: 250, proteinas: 3.0, carboidratos: 30.0, gorduras: 13.0, fibra: 0.5 },
  { id: 174, nome: 'Manjar', categoria: 'Outros', calorias: 180, proteinas: 4.0, carboidratos: 28.0, gorduras: 6.0, fibra: 0.5 },
  { id: 175, nome: 'Rabanada', categoria: 'Outros', calorias: 280, proteinas: 6.0, carboidratos: 35.0, gorduras: 13.0, fibra: 1.0 },
  { id: 176, nome: 'Churros', categoria: 'Outros', calorias: 300, proteinas: 5.0, carboidratos: 40.0, gorduras: 14.0, fibra: 1.0 },
  { id: 177, nome: 'Acarajé', categoria: 'Outros', calorias: 280, proteinas: 8.0, carboidratos: 25.0, gorduras: 16.0, fibra: 3.0 },
  { id: 178, nome: 'Abará', categoria: 'Outros', calorias: 200, proteinas: 6.0, carboidratos: 20.0, gorduras: 10.0, fibra: 2.5 },
  { id: 179, nome: 'Tapioca com coco', categoria: 'Outros', calorias: 250, proteinas: 2.0, carboidratos: 45.0, gorduras: 7.0, fibra: 2.0 },
  { id: 180, nome: 'Biscoito de polvilho', categoria: 'Outros', calorias: 350, proteinas: 1.0, carboidratos: 80.0, gorduras: 3.0, fibra: 0.5 },
  { id: 181, nome: 'Biscoito cream cracker', categoria: 'Outros', calorias: 430, proteinas: 10.0, carboidratos: 65.0, gorduras: 14.0, fibra: 2.5 },
  { id: 182, nome: 'Biscoito recheado', categoria: 'Outros', calorias: 480, proteinas: 5.0, carboidratos: 65.0, gorduras: 22.0, fibra: 1.5 },
  { id: 183, nome: 'Salgadinho', categoria: 'Outros', calorias: 500, proteinas: 6.0, carboidratos: 55.0, gorduras: 28.0, fibra: 2.0 },
  { id: 184, nome: 'Batata chips', categoria: 'Outros', calorias: 530, proteinas: 6.0, carboidratos: 52.0, gorduras: 33.0, fibra: 4.0 },
  { id: 185, nome: 'Pretzels', categoria: 'Outros', calorias: 380, proteinas: 10.0, carboidratos: 75.0, gorduras: 3.0, fibra: 2.5 },
  { id: 186, nome: 'Fruta seca (mix)', categoria: 'Outros', calorias: 450, proteinas: 10.0, carboidratos: 55.0, gorduras: 22.0, fibra: 5.0 },
  { id: 187, nome: 'Cranberry seco', categoria: 'Outros', calorias: 325, proteinas: 0.1, carboidratos: 82.0, gorduras: 1.0, fibra: 5.0 },
  { id: 188, nome: 'Uva passa', categoria: 'Outros', calorias: 299, proteinas: 3.1, carboidratos: 79.0, gorduras: 0.5, fibra: 3.7 },
  { id: 189, nome: 'Figos secos', categoria: 'Outros', calorias: 249, proteinas: 3.3, carboidratos: 63.9, gorduras: 0.9, fibra: 9.8 },
  { id: 190, nome: 'Tâmara', categoria: 'Outros', calorias: 277, proteinas: 1.8, carboidratos: 75.0, gorduras: 0.2, fibra: 6.7 },
  { id: 191, nome: 'Coco ralado', categoria: 'Outros', calorias: 660, proteinas: 6.9, carboidratos: 24.0, gorduras: 64.5, fibra: 16.3 },
  { id: 192, nome: 'Leite de coco', categoria: 'Outros', calorias: 197, proteinas: 2.0, carboidratos: 3.0, gorduras: 20.0, fibra: 0 },
  { id: 193, nome: 'Leite de soja', categoria: 'Bebidas', calorias: 33, proteinas: 2.8, carboidratos: 1.6, gorduras: 1.6, fibra: 0.5 },
  { id: 194, nome: 'Leite de amêndoa', categoria: 'Bebidas', calorias: 17, proteinas: 0.6, carboidratos: 0.6, gorduras: 1.1, fibra: 0.2 },
  { id: 195, nome: 'Leite de aveia', categoria: 'Bebidas', calorias: 40, proteinas: 1.0, carboidratos: 7.0, gorduras: 1.0, fibra: 0.8 },
  { id: 196, nome: 'Hambúrguer de soja', categoria: 'Outros', calorias: 130, proteinas: 15.0, carboidratos: 8.0, gorduras: 4.0, fibra: 4.0 },
  { id: 197, nome: 'Salsicha de soja', categoria: 'Outros', calorias: 150, proteinas: 12.0, carboidratos: 10.0, gorduras: 7.0, fibra: 3.0 },
  { id: 198, nome: 'Proteína de soja texturizada', categoria: 'Outros', calorias: 329, proteinas: 52.0, carboidratos: 30.0, gorduras: 1.0, fibra: 15.0 },
  { id: 199, nome: 'Grão-de-bico cozido', categoria: 'Cereais', calorias: 120, proteinas: 6.3, carboidratos: 20.0, gorduras: 2.6, fibra: 5.5 },
  { id: 200, nome: 'Lentilha cozida', categoria: 'Cereais', calorias: 93, proteinas: 7.6, carboidratos: 16.0, gorduras: 0.4, fibra: 6.2 },
];

const categorias = ['Todas', 'Carnes', 'Cereais', 'Frutas', 'Laticínios', 'Legumes', 'Bebidas', 'Gorduras', 'Outros'];

export default function TabelaCalorias() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [porcao, setPorcao] = useState('100');

  const alimentosFiltrados = useMemo(() => {
    return alimentos.filter((a) => {
      const matchBusca = a.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCategoria = categoriaFiltro === 'Todas' || a.categoria === categoriaFiltro;
      return matchBusca && matchCategoria;
    });
  }, [busca, categoriaFiltro]);

  const calcularPorcao = (valor: number) => {
    const peso = parseFloat(porcao) || 100;
    return (valor * peso) / 100;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Tabela de Calorias dos Alimentos</h1>
      <p className="text-gray-600 mb-8">
        Consulte as calorias e informações nutricionais de mais de 200 alimentos brasileiros
        baseados na tabela TACO do IBGE. Busque por nome e calcule os valores para qualquer porção.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar alimento</label>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex: arroz, frango, banana..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Porção (g)</label>
            <input
              type="number"
              value={porcao}
              onChange={(e) => setPorcao(e.target.value)}
              placeholder="100"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categoriaFiltro === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        {alimentosFiltrados.length} alimento{alimentosFiltrados.length !== 1 ? 's' : ''} encontrado{alimentosFiltrados.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {alimentosFiltrados.map((alimento) => (
          <div key={alimento.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{alimento.nome}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{alimento.categoria}</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{calcularPorcao(alimento.calorias).toFixed(0)}</p>
                <p className="text-xs text-gray-400">kcal</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-blue-600 font-medium">Proteínas</p>
                <p className="text-sm font-bold text-blue-800">{calcularPorcao(alimento.proteinas).toFixed(1)}g</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs text-green-600 font-medium">Carbos</p>
                <p className="text-sm font-bold text-green-800">{calcularPorcao(alimento.carboidratos).toFixed(1)}g</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2">
                <p className="text-xs text-yellow-600 font-medium">Gorduras</p>
                <p className="text-sm font-bold text-yellow-800">{calcularPorcao(alimento.gorduras).toFixed(1)}g</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <p className="text-xs text-purple-600 font-medium">Fibras</p>
                <p className="text-sm font-bold text-purple-800">{calcularPorcao(alimento.fibra).toFixed(1)}g</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {alimentosFiltrados.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-500">Nenhum alimento encontrado com esses filtros.</p>
        </div>
      )}

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre a Tabela TACO</h2>
        <p>
          A Tabela Brasileira de Composição de Alimentos (TACO) é um projeto do Núcleo de Estudos e
          Pesquisas em Alimentação (NEPA) da Universidade Estadual de Campinas (UNICAMP), financiado
          pelo Ministério da Saúde e pelo IBGE. Contém dados nutricionais de alimentos consumidos no
          Brasil, incluindo valores de energia, proteínas, carboidratos, gorduras, fibras e vitaminas.
        </p>
        <h3>Como usar esta tabela</h3>
        <p>
          Use o campo de busca para encontrar qualquer alimento. Selecione uma categoria para filtrar
          os resultados. Ajuste o valor da porção em gramas para ver os valores nutricionais
          recalculados para a quantidade que você consome.
        </p>
      </article>
    </div>
  );
}
