/**
 * Unicode Text Converter
 * Converts regular text into various Unicode styles in real-time
 */

// Unicode character mappings for different styles
const unicodeStyles = {
    // Circled lowercase letters
    circled: {
        name: 'Circled',
        map: {
            'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ',
            'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ',
            's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
            'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ',
            'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ',
            'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
            '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
        }
    },

    // Circled negative (white text on black circle)
    circledNegative: {
        name: 'Circled (Negative)',
        map: {
            'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗', 'i': '🅘',
            'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡',
            's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩',
            'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗', 'I': '🅘',
            'J': '🅙', 'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡',
            'S': '🅢', 'T': '🅣', 'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩'
        }
    },

    // Fullwidth (Japanese/Chinese style wide characters)
    fullwidth: {
        name: 'Fullwidth',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // ASCII range 33-126 maps to fullwidth FF01-FF5E
            if (code >= 33 && code <= 126) {
                return String.fromCharCode(code + 0xFF00 - 0x20);
            }
            // Space
            if (code === 32) return '\u3000';
            return char;
        }
    },

    // Math Bold
    mathBold: {
        name: 'Math Bold',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D400 - U+1D419
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D400 + (code - 65));
            }
            // Lowercase a-z: U+1D41A - U+1D433
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D41A + (code - 97));
            }
            return char;
        }
    },

    // Math Bold Fraktur
    mathBoldFraktur: {
        name: 'Math Bold Fraktur',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D56C - U+1D585
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D56C + (code - 65));
            }
            // Lowercase a-z: U+1D586 - U+1D59F
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D586 + (code - 97));
            }
            return char;
        }
    },

    // Math Bold Italic
    mathBoldItalic: {
        name: 'Math Bold Italic',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D468 - U+1D481
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D468 + (code - 65));
            }
            // Lowercase a-z: U+1D482 - U+1D49B
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D482 + (code - 97));
            }
            return char;
        }
    },

    // Math Bold Script
    mathBoldScript: {
        name: 'Math Bold Script',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D4D0 - U+1D4E9
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D4D0 + (code - 65));
            }
            // Lowercase a-z: U+1D4EA - U+1D503
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D4EA + (code - 97));
            }
            return char;
        }
    },

    // Math Double-Struck
    mathDoubleStruck: {
        name: 'Math Double-Struck',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D538 - U+1D551 (with some exceptions)
            if (code >= 65 && code <= 90) {
                if (char === 'C') return 'ℂ';
                if (char === 'H') return 'ℍ';
                if (char === 'N') return 'ℕ';
                if (char === 'P') return 'ℙ';
                if (char === 'Q') return 'ℚ';
                if (char === 'R') return 'ℝ';
                if (char === 'Z') return 'ℤ';
                return String.fromCodePoint(0x1D538 + (code - 65));
            }
            // Lowercase a-z: U+1D552 - U+1D56B
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D552 + (code - 97));
            }
            return char;
        }
    },

    // Math Monospace
    mathMonospace: {
        name: 'Math Monospace',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D670 - U+1D689
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D670 + (code - 65));
            }
            // Lowercase a-z: U+1D68A - U+1D6A3
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D68A + (code - 97));
            }
            // Digits 0-9: U+1D7F6 - U+1D7FF
            if (code >= 48 && code <= 57) {
                return String.fromCodePoint(0x1D7F6 + (code - 48));
            }
            return char;
        }
    },

    // Math Sans
    mathSans: {
        name: 'Math Sans',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D5A0 - U+1D5B9
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D5A0 + (code - 65));
            }
            // Lowercase a-z: U+1D5BA - U+1D5D3
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D5BA + (code - 97));
            }
            return char;
        }
    },

    // Math Sans Bold
    mathSansBold: {
        name: 'Math Sans Bold',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D5D4 - U+1D5ED
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D5D4 + (code - 65));
            }
            // Lowercase a-z: U+1D5EE - U+1D607
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D5EE + (code - 97));
            }
            return char;
        }
    },

    // Math Sans Bold Italic
    mathSansBoldItalic: {
        name: 'Math Sans Bold Italic',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D63C - U+1D655
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D63C + (code - 65));
            }
            // Lowercase a-z: U+1D656 - U+1D66F
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D656 + (code - 97));
            }
            return char;
        }
    },

    // Math Sans Italic
    mathSansItalic: {
        name: 'Math Sans Italic',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D608 - U+1D621
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D608 + (code - 65));
            }
            // Lowercase a-z: U+1D622 - U+1D63B
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D622 + (code - 97));
            }
            return char;
        }
    },

    // Parenthesized
    parenthesized: {
        name: 'Parenthesized',
        map: {
            'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢', 'h': '⒣', 'i': '⒤',
            'j': '⒥', 'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩', 'o': '⒪', 'p': '⒫', 'q': '⒬', 'r': '⒭',
            's': '⒮', 't': '⒯', 'u': '⒰', 'v': '⒱', 'w': '⒲', 'x': '⒳', 'y': '⒴', 'z': '⒵',
            'A': '⒜', 'B': '⒝', 'C': '⒞', 'D': '⒟', 'E': '⒠', 'F': '⒡', 'G': '⒢', 'H': '⒣', 'I': '⒤',
            'J': '⒥', 'K': '⒦', 'L': '⒧', 'M': '⒨', 'N': '⒩', 'O': '⒪', 'P': '⒫', 'Q': '⒬', 'R': '⒭',
            'S': '⒮', 'T': '⒯', 'U': '⒰', 'V': '⒱', 'W': '⒲', 'X': '⒳', 'Y': '⒴', 'Z': '⒵',
            '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼'
        }
    },

    // Regional Indicator (flag letters)
    regionalIndicator: {
        name: 'Regional Indicator',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Both uppercase and lowercase A-Z map to regional indicators
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1F1E6 + (code - 65));
            }
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1F1E6 + (code - 97));
            }
            return char;
        }
    },

    // Squared
    squared: {
        name: 'Squared',
        map: {
            'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸',
            'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁',
            's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
            'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸',
            'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁',
            'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉'
        }
    },

    // Squared Negative
    squaredNegative: {
        name: 'Squared (Negative)',
        map: {
            'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷', 'i': '🅸',
            'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿', 'q': '🆀', 'r': '🆁',
            's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇', 'y': '🆈', 'z': '🆉',
            'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸',
            'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁',
            'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉'
        }
    },

    // Small Caps
    smallCaps: {
        name: 'Small Caps',
        map: {
            'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
            'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
            's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
            'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
            'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
            'S': 'ꜱ', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
        }
    },

    // Subscript
    subscript: {
        name: 'Subscript',
        map: {
            'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ',
            'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ',
            '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
            '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
        }
    },

    // Superscript
    superscript: {
        name: 'Superscript',
        map: {
            'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ',
            'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ',
            't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
            'A': 'ᴬ', 'B': 'ᴮ', 'D': 'ᴰ', 'E': 'ᴱ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ',
            'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'R': 'ᴿ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ',
            '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
            '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
        }
    },

    // Inverted (upside down)
    inverted: {
        name: 'Inverted',
        map: {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ',
            'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ',
            's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
            'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I',
            'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'b', 'R': 'ɹ',
            'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
            '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
            '.': '˙', ',': '\'', '!': '¡', '?': '¿', '\'': ',', '"': '„', '(': ')', ')': '('
        }
    },

    // Inverted Backwards
    invertedBackwards: {
        name: 'Inverted (Backwards)',
        map: {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ',
            'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ',
            's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
            'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': 'פ', 'H': 'H', 'I': 'I',
            'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'b', 'R': 'ɹ',
            'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
            '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
            '.': '˙', ',': '\'', '!': '¡', '?': '¿', '\'': ',', '"': '„', '(': ')', ')': '('
        },
        reverse: true
    },

    // Reversed (mirrored)
    reversed: {
        name: 'Reversed',
        map: {
            'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ʇ', 'g': 'ǫ', 'j': 'į', 'k': 'ʞ',
            'n': 'n', 'p': 'q', 'q': 'p', 's': 'ꙅ', 'y': 'ʏ', 'z': 'ƹ',
            'A': 'A', 'B': 'd', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': 'Ә', 'J': 'Ⴑ', 'K': 'ﻼ',
            'L': '⅃', 'N': 'И', 'P': 'ꟼ', 'Q': 'Ọ', 'R': 'Я', 'S': 'Ꙅ', 'T': 'T', 'Y': 'Y', 'Z': 'Ƹ'
        }
    },

    // Reversed Backwards
    reversedBackwards: {
        name: 'Reversed (Backwards)',
        map: {
            'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ʇ', 'g': 'ǫ', 'j': 'į', 'k': 'ʞ',
            'n': 'n', 'p': 'q', 'q': 'p', 's': 'ꙅ', 'y': 'ʏ', 'z': 'ƹ',
            'A': 'A', 'B': 'd', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ', 'G': 'Ә', 'J': 'Ⴑ', 'K': 'ﻼ',
            'L': '⅃', 'N': 'И', 'P': 'ꟼ', 'Q': 'Ọ', 'R': 'Я', 'S': 'Ꙅ', 'T': 'T', 'Y': 'Y', 'Z': 'Ƹ'
        },
        reverse: true
    },

    // Strikethrough
    strikethrough: {
        name: 'Strikethrough',
        transform: (char) => {
            // Add combining strikethrough (U+0336) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0336';
            }
            return char;
        }
    },

    // Underlined
    underlined: {
        name: 'Underlined',
        transform: (char) => {
            // Add combining underline (U+0332) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0332';
            }
            return char;
        }
    },

    // Double Underlined
    doubleUnderlined: {
        name: 'Double Underlined',
        transform: (char) => {
            // Add combining double underline (U+0333) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0333';
            }
            return char;
        }
    },

    // Overlined
    overlined: {
        name: 'Overlined',
        transform: (char) => {
            // Add combining overline (U+0305) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0305';
            }
            return char;
        }
    },

    // Slashed
    slashed: {
        name: 'Slashed',
        transform: (char) => {
            // Add combining short slash overlay (U+0337) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0337';
            }
            return char;
        }
    },

    // Math Italic
    mathItalic: {
        name: 'Math Italic',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D434 - U+1D44D
            if (code >= 65 && code <= 90) {
                return String.fromCodePoint(0x1D434 + (code - 65));
            }
            // Lowercase a-z: U+1D44E - U+1D467
            if (code >= 97 && code <= 122) {
                // Special case for h (U+210E)
                if (char === 'h') return 'ℎ';
                return String.fromCodePoint(0x1D44E + (code - 97));
            }
            return char;
        }
    },

    // Math Fraktur
    mathFraktur: {
        name: 'Math Fraktur',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D504 - U+1D51D
            if (code >= 65 && code <= 90) {
                // Special cases
                if (char === 'C') return 'ℌ';
                if (char === 'H') return 'ℌ';
                if (char === 'I') return 'ℑ';
                if (char === 'R') return 'ℜ';
                if (char === 'Z') return 'ℨ';
                return String.fromCodePoint(0x1D504 + (code - 65));
            }
            // Lowercase a-z: U+1D51E - U+1D537
            if (code >= 97 && code <= 122) {
                return String.fromCodePoint(0x1D51E + (code - 97));
            }
            return char;
        }
    },

    // Math Script
    mathScript: {
        name: 'Math Script',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Uppercase A-Z: U+1D49C - U+1D4B5
            if (code >= 65 && code <= 90) {
                // Special cases
                if (char === 'B') return 'ℬ';
                if (char === 'E') return 'ℰ';
                if (char === 'F') return 'ℱ';
                if (char === 'H') return 'ℋ';
                if (char === 'I') return 'ℐ';
                if (char === 'L') return 'ℒ';
                if (char === 'M') return 'ℳ';
                if (char === 'R') return 'ℛ';
                return String.fromCodePoint(0x1D49C + (code - 65));
            }
            // Lowercase a-z: U+1D4B6 - U+1D4CF
            if (code >= 97 && code <= 122) {
                // Special cases
                if (char === 'e') return 'ℯ';
                if (char === 'g') return 'ℊ';
                if (char === 'o') return 'ℴ';
                return String.fromCodePoint(0x1D4B6 + (code - 97));
            }
            return char;
        }
    },

    // Currency
    currency: {
        name: 'Currency',
        map: {
            'a': '₳', 'b': '฿', 'c': '₵', 'd': '₫', 'e': '€', 'f': 'ƒ', 'l': '£', 'n': '₦',
            'p': '₱', 'r': '₹', 's': '$', 't': '₮', 'w': '₩', 'y': '¥',
            'A': '₳', 'B': '฿', 'C': '₵', 'D': '₫', 'E': '€', 'F': 'ƒ', 'L': '£', 'N': '₦',
            'P': '₱', 'R': '₹', 'S': '$', 'T': '₮', 'W': '₩', 'Y': '¥'
        }
    },

    // Asian Fullwidth
    asianFullwidth: {
        name: 'Asian Fullwidth',
        transform: (char) => {
            const code = char.charCodeAt(0);
            // Convert ASCII to fullwidth
            if (code >= 33 && code <= 126) {
                return String.fromCharCode(code + 0xFF00 - 0x20);
            }
            if (code === 32) return '\u3000'; // Fullwidth space
            return char;
        }
    },

    // Bubble Text
    bubbleText: {
        name: 'Bubble Text',
        map: {
            'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ',
            'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ',
            's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
            'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ',
            'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ',
            'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
            '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
        }
    },

    // Dotted
    dotted: {
        name: 'Dotted',
        transform: (char) => {
            // Add combining dot above (U+0307) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0307';
            }
            return char;
        }
    },

    // Crossed Out
    crossedOut: {
        name: 'Crossed Out',
        transform: (char) => {
            // Add combining long stroke overlay (U+0336) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0336';
            }
            return char;
        }
    },

    // Tilded
    tilded: {
        name: 'Tilded',
        transform: (char) => {
            // Add combining tilde (U+0303) after each character
            if (char !== ' ' && char !== '\n') {
                return char + '\u0303';
            }
            return char;
        }
    },

    // Zalgo (Creepy)
    zalgo: {
        name: 'Zalgo (Creepy)',
        hasOptions: true,
        options: {
            intensity: { min: 1, max: 10, default: 3, label: 'Intensity' }
        },
        transform: (char, options = {}) => {
            if (char === ' ' || char === '\n') return char;

            const combining = [
                '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
                '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
                '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u031B', '\u033D', '\u033E',
                '\u033F', '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0346', '\u034A',
                '\u034B', '\u034C', '\u0350', '\u0351', '\u0352', '\u0357', '\u035B', '\u0363',
                '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036A', '\u036B',
                '\u036C', '\u036D', '\u036E', '\u036F'
            ];

            let result = char;
            const intensity = options.intensity || 3;
            const numMarks = Math.floor(Math.random() * intensity) + 1;
            for (let i = 0; i < numMarks; i++) {
                result += combining[Math.floor(Math.random() * combining.length)];
            }
            return result;
        }
    }
};

// Store for style options
const styleOptions = {};

/**
 * Convert text using a specific Unicode style
 * @param {string} text - The input text to convert
 * @param {Object} style - The style configuration object
 * @param {string} styleKey - The key of the style
 * @returns {string} - The converted text
 */
function convertText(text, style, styleKey) {
    if (!text) return '';

    let result = '';
    const options = styleOptions[styleKey] || {};

    // Use transform function if available
    if (style.transform) {
        for (let char of text) {
            result += style.transform(char, options);
        }
    }
    // Otherwise use character map
    else if (style.map) {
        for (let char of text) {
            result += style.map[char] || char;
        }
    }

    // Reverse the result if needed (for backwards variants)
    if (style.reverse) {
        result = result.split('').reverse().join('');
    }

    return result;
}

/**
 * Create a result card element
 * @param {string} styleKey - The key of the style
 * @param {Object} style - The style object
 * @param {string} convertedText - The converted text
 * @returns {HTMLElement} - The result card element
 */
function createResultCard(styleKey, style, convertedText) {
    const card = document.createElement('div');
    card.className = 'result-card';

    // Add options panel if the style has options
    if (style.hasOptions && style.options) {
        const optionsDiv = createOptionsPanel(styleKey, style.options);
        card.appendChild(optionsDiv);
    }

    const header = document.createElement('div');
    header.className = 'result-header';

    const label = document.createElement('div');
    label.className = 'result-label';
    label.textContent = style.name;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('data-text', convertedText);
    copyBtn.addEventListener('click', handleCopy);

    header.appendChild(label);
    header.appendChild(copyBtn);

    const textDiv = document.createElement('div');
    textDiv.className = 'result-text';
    textDiv.textContent = convertedText;

    card.appendChild(header);
    card.appendChild(textDiv);

    return card;
}

/**
 * Create an options panel for styles with customizable options
 * @param {string} styleKey - The key of the style
 * @param {Object} options - The options configuration
 * @returns {HTMLElement} - The options panel element
 */
function createOptionsPanel(styleKey, options) {
    const panel = document.createElement('div');
    panel.className = 'style-options';

    for (let [optionKey, config] of Object.entries(options)) {
        const group = document.createElement('div');
        group.className = 'option-group';

        const label = document.createElement('div');
        label.className = 'option-label';
        label.textContent = config.label;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'slider';
        slider.min = config.min;
        slider.max = config.max;
        slider.value = config.default;
        slider.id = `${styleKey}-${optionKey}`;

        const value = document.createElement('div');
        value.className = 'option-value';
        value.textContent = config.default;
        value.id = `${styleKey}-${optionKey}-value`;

        // Initialize option value
        if (!styleOptions[styleKey]) {
            styleOptions[styleKey] = {};
        }
        styleOptions[styleKey][optionKey] = config.default;

        // Handle slider change
        slider.addEventListener('input', (e) => {
            const newValue = parseInt(e.target.value);
            value.textContent = newValue;
            styleOptions[styleKey][optionKey] = newValue;
            updateConversions();
        });

        group.appendChild(label);
        group.appendChild(slider);
        group.appendChild(value);
        panel.appendChild(group);
    }

    return panel;
}

/**
 * Handle copy button click
 * @param {Event} event - The click event
 */
function handleCopy(event) {
    const text = event.target.getAttribute('data-text');

    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        showToast();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

/**
 * Show toast notification
 */
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/**
 * Update all conversions based on input text
 */
function updateConversions() {
    const inputText = document.getElementById('inputText').value;
    const resultsContainer = document.getElementById('results');

    // Clear existing results
    resultsContainer.innerHTML = '';

    // Generate results for each style
    for (let [key, style] of Object.entries(unicodeStyles)) {
        const converted = convertText(inputText, style, key);
        const card = createResultCard(key, style, converted);
        resultsContainer.appendChild(card);
    }
}

/**
 * =================
 * TAB SWITCHING
 * =================
 */

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to selected button
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

function initTabSwitching() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

/**
 * =================
 * HASH GENERATOR
 * =================
 */

async function generateHash(text, algorithm) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function updateHashes() {
    const inputText = document.getElementById('hashInput').value;
    const resultsContainer = document.getElementById('hashResults');

    // Clear existing results
    resultsContainer.innerHTML = '';

    if (!inputText) {
        return;
    }

    const algorithms = [
        { name: 'SHA-1', algo: 'SHA-1' },
        { name: 'SHA-256', algo: 'SHA-256' },
        { name: 'SHA-384', algo: 'SHA-384' },
        { name: 'SHA-512', algo: 'SHA-512' }
    ];

    algorithms.forEach(async ({ name, algo }) => {
        try {
            const hash = await generateHash(inputText, algo);
            const card = createSimpleCard(name, hash);
            resultsContainer.appendChild(card);
        } catch (error) {
            console.error(`Error generating ${name}:`, error);
        }
    });
}

/**
 * =================
 * ENCODING & TEXT UTILITIES
 * =================
 */

const encodingFunctions = {
    'Base64 Encode': (text) => btoa(unescape(encodeURIComponent(text))),
    'Base64 Decode': (text) => {
        try {
            return decodeURIComponent(escape(atob(text)));
        } catch (e) {
            return 'Invalid Base64';
        }
    },
    'URL Encode': (text) => encodeURIComponent(text),
    'URL Decode': (text) => {
        try {
            return decodeURIComponent(text);
        } catch (e) {
            return 'Invalid URL encoding';
        }
    },
    'HTML Entities Encode': (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    'HTML Entities Decode': (text) => {
        const div = document.createElement('div');
        div.innerHTML = text;
        return div.textContent;
    },
    'Hex Encode': (text) => {
        return Array.from(text).map(c =>
            c.charCodeAt(0).toString(16).padStart(2, '0')
        ).join('');
    },
    'Hex Decode': (text) => {
        try {
            const hex = text.replace(/\s/g, '');
            let str = '';
            for (let i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return str;
        } catch (e) {
            return 'Invalid hex';
        }
    },
    'Binary Encode': (text) => {
        return Array.from(text).map(c =>
            c.charCodeAt(0).toString(2).padStart(8, '0')
        ).join(' ');
    },
    'Binary Decode': (text) => {
        try {
            return text.split(/\s+/).map(bin =>
                String.fromCharCode(parseInt(bin, 2))
            ).join('');
        } catch (e) {
            return 'Invalid binary';
        }
    },
    'Reverse Text': (text) => text.split('').reverse().join(''),
    'Word Count': (text) => {
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const lines = text.split('\n').length;
        return `Words: ${words.length} | Characters: ${chars} | Chars (no spaces): ${charsNoSpaces} | Lines: ${lines}`;
    },
    'Uppercase': (text) => text.toUpperCase(),
    'Lowercase': (text) => text.toLowerCase(),
    'Title Case': (text) => {
        return text.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },
    'Remove Whitespace': (text) => text.replace(/\s/g, ''),
    'Remove Duplicate Lines': (text) => {
        const lines = text.split('\n');
        return [...new Set(lines)].join('\n');
    },
    'Sort Lines (A-Z)': (text) => {
        return text.split('\n').sort().join('\n');
    },
    'Sort Lines (Z-A)': (text) => {
        return text.split('\n').sort().reverse().join('\n');
    }
};

function updateEncodings() {
    const inputText = document.getElementById('encodingInput').value;
    const resultsContainer = document.getElementById('encodingResults');

    // Clear existing results
    resultsContainer.innerHTML = '';

    if (!inputText) {
        return;
    }

    for (let [name, func] of Object.entries(encodingFunctions)) {
        try {
            const result = func(inputText);
            const card = createSimpleCard(name, result);
            resultsContainer.appendChild(card);
        } catch (error) {
            console.error(`Error with ${name}:`, error);
        }
    }
}

/**
 * =================
 * DOCS NAVIGATION
 * =================
 */

function switchDoc(docName) {
    // Hide all doc articles
    document.querySelectorAll('.doc-article').forEach(article => {
        article.classList.remove('active');
    });

    // Remove active class from all doc links
    document.querySelectorAll('.doc-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected doc article
    const selectedDoc = document.getElementById(`doc-${docName}`);
    if (selectedDoc) {
        selectedDoc.classList.add('active');
    }

    // Add active class to selected link
    const selectedLink = document.querySelector(`[data-doc="${docName}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }

    // Scroll to top of docs content
    const docsContent = document.querySelector('.docs-content');
    if (docsContent) {
        docsContent.scrollTop = 0;
    }
}

function initDocsNavigation() {
    document.querySelectorAll('.doc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const docName = e.target.getAttribute('data-doc');
            switchDoc(docName);
        });
    });
}

/**
 * =================
 * HELPER FUNCTIONS
 * =================
 */

function createSimpleCard(title, content) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const header = document.createElement('div');
    header.className = 'result-header';

    const label = document.createElement('div');
    label.className = 'result-label';
    label.textContent = title;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('data-text', content);
    copyBtn.addEventListener('click', handleCopy);

    header.appendChild(label);
    header.appendChild(copyBtn);

    const textDiv = document.createElement('div');
    textDiv.className = 'result-text';
    textDiv.textContent = content;

    card.appendChild(header);
    card.appendChild(textDiv);

    return card;
}

/**
 * =================
 * INITIALIZATION
 * =================
 */

function init() {
    // Initialize tab switching
    initTabSwitching();

    // Initialize docs navigation
    initDocsNavigation();

    // Unicode converter
    const inputText = document.getElementById('inputText');
    if (inputText) {
        inputText.addEventListener('input', updateConversions);
        updateConversions();
        inputText.focus();
        inputText.setSelectionRange(inputText.value.length, inputText.value.length);
    }

    // Hash generator
    const hashInput = document.getElementById('hashInput');
    if (hashInput) {
        hashInput.addEventListener('input', updateHashes);
    }

    // Encoding utilities
    const encodingInput = document.getElementById('encodingInput');
    if (encodingInput) {
        encodingInput.addEventListener('input', updateEncodings);
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
