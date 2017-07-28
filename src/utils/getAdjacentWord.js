const SEPERATOR = ' '

// the additional index takes care of the space
function getNextWordIndices({ sentence, wordBoundaryIndex }) {
	var nextSeperatorIndex = sentence.indexOf(SEPERATOR, wordBoundaryIndex + 2)

	return [
		wordBoundaryIndex + 2,
		// if the seperator is not found following the concerned word
		// then the next word must be the last word
		nextSeperatorIndex === -1 ? sentence.length - 1 : nextSeperatorIndex
	]
}

function getPreviousWordIndices({ sentence, wordBoundaryIndex }) {
	var previousSeperatorIndex = sentence.indexOf(
		SEPERATOR,
		wordBoundaryIndex + 2
	)
	return [
		// if the seperator is not found trailing the concerned word
		// then the previous word must be the first word
		previousSeperatorIndex === -1 ? 0 : previousSeperatorIndex,
		wordBoundaryIndex - 2
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
