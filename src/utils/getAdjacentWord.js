const SEPERATOR = ' '

// the additional index takes care of the space
function getNextWordIndices({ sentence, wordBoundaryIndex }) {
	var nextSeperatorIndex = sentence.indexOf(SEPERATOR, wordBoundaryIndex + 2)

	return [
		wordBoundaryIndex + 1,
		// if the seperator is not found following the concerned word
		// then the next word must be the last word
		nextSeperatorIndex === -1 ? sentence.length - 1 : nextSeperatorIndex
	]
}

function getPreviousWordIndices({ sentence, wordBoundaryIndex }) {
	var str = sentence.substr(0,wordBoundaryIndex-1)
	var previousWordStartIndex = str.lastIndexOf(SEPERATOR)+1
	var wordsArray =str.split(SEPERATOR)
	var previousWord =wordsArray[wordsArray.length-1]
	var previousWordEndIndex =previousWordStartIndex+previousWord.length
	return [
		previousWordStartIndex,
		previousWordEndIndex
	]
}

function getAdjacentWord({
	sentence,
	word: { indices: [wordStartIndex, wordEndIndex] },
	direction = 'next'
}) {
	if (direction === 'next') {
		return getNextWordIndices({ sentence, wordBoundaryIndex: wordEndIndex })
	} else if (direction === 'previous') {
		return getPreviousWordIndices({
			sentence,
			wordBoundaryIndex: wordStartIndex
		})
	}
}

export default function getAdjacentWords(args) {
	return {
		previous: getAdjacentWord({ ...args, direction: 'previous' }),
		next: getAdjacentWord({ ...args, direction: 'next' })
	}
}
