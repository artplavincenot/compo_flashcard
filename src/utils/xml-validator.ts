import { DOMParser } from '@xmldom/xmldom';

export interface XMLValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateXMLStructure = (xmlContent: string): XMLValidationResult => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    // Check for parsing errors
    const errors: string[] = [];
    parser.errorHandler = {
      warning: (msg) => errors.push(msg),
      error: (msg) => errors.push(msg),
      fatalError: (msg) => errors.push(msg),
    };

    if (errors.length > 0) {
      return {
        isValid: false,
        error: "Format XML invalide: " + errors[0]
      };
    }

    // Validate deck element and name attribute
    const deck = xmlDoc.getElementsByTagName("deck")[0];
    if (!deck) {
      return {
        isValid: false,
        error: "Aucun deck trouvé dans le fichier XML"
      };
    }

    const deckName = deck.getAttribute("name");
    if (!deckName) {
      return {
        isValid: false,
        error: "Attribut 'name' manquant dans le deck"
      };
    }

    // Validate fields section
    const fields = deck.getElementsByTagName("fields")[0];
    if (!fields) {
      return {
        isValid: false,
        error: "Section 'fields' manquante"
      };
    }

    // Validate required field definitions
const imgField = fields.querySelector('img[name="Image"]');
const textUnderImageField = fields.querySelector('text[name="Texte sous l\'image"]');
const textField = fields.querySelector('text[name="Texte"]');


    
    if (!imgField || !textUnderImageField || !textField) {
      return {
        isValid: false,
        error: "Structure des champs invalide. Vérifiez les noms des champs"
      };
    }

    // Validate cards section
    const cards = deck.getElementsByTagName("cards")[0];
    if (!cards) {
      return {
        isValid: false,
        error: "Section 'cards' manquante"
      };
    }

    const cardElements = cards.getElementsByTagName("card");
    if (cardElements.length === 0) {
      return {
        isValid: false,
        error: `Aucune carte trouvée dans le deck "${deckName}"`
      };
    }

    // Validate each card structure
    for (let i = 0; i < cardElements.length; i++) {
      const card = cardElements[i];
      
      // Check image element
      const imageElement = card.querySelector('img[name="Image"] img[type="png"]');
      if (!imageElement || !imageElement.getAttribute('id')) {
        return {
          isValid: false,
          error: `Image manquante ou invalide dans la carte ${i + 1}`
        };
      }

      // Check text elements
      const frontText = card.querySelector('text[name="Texte sous l\'image"]');
      const backText = card.querySelector('text[name="Texte"]');
      
      if (!frontText?.textContent?.trim() || !backText?.textContent?.trim()) {
        return {
          isValid: false,
          error: `Textes manquants ou vides dans la carte ${i + 1}`
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: "Erreur lors de la validation du XML: " + (error as Error).message
    };
  }
};