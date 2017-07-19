export default function wordPosToIndex(sentence, pos) {
	// given the position of a word in a sentence,
	// get the index of the first of the word in the sentence
	// if the sentence is "I lurve you" and the word is "lurve"
	// position of the word is 1 (pos is a zero based number)
	// and start index is 3
	var arrayOfWords = sentence.split(' ')
	let startIndex = 0
	for (let i = 0; i < pos; i++) {
		// adding the length gives the position of the space after the word
		// adding 1 to that agian gives us the starting index of the next word
		startIndex += arrayOfWords[i].length + 1
	}

	return startIndex
}
