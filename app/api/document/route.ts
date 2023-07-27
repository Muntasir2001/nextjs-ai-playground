import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Prisma, Document } from '@prisma/client';
import prisma from '@/prisma/prisma';

const run = async () => {
	// Use the `withModel` method to get proper type hints for `metadata` field:
	const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
		new OpenAIEmbeddings({ openAIApiKey: process.env.openai_api_key }),
		{
			prisma: Prisma,
			tableName: 'Document',
			vectorColumnName: 'vector',
			columns: {
				id: PrismaVectorStore.IdColumn,
				content: PrismaVectorStore.ContentColumn,
			},
		},
	);

	//   dummy texts to be inserted
	const texts = ['Hello world', 'Bye bye', 'An apple is a fruit', 'sa,'];
	await vectorStore.addModels(
		await prisma.$transaction(
			texts.map((content) =>
				prisma.document.create({
					data: {
						content,
					},
				}),
			),
		),
	);

	const resultOne = await vectorStore.similaritySearch("What's apple?", 1);
	console.log(resultOne);
	console.log(typeof resultOne[0]);

	// // create an instance with default filter
	// const vectorStore2 = PrismaVectorStore.withModel<Document>(prisma).create(
	// 	new OpenAIEmbeddings(),
	// 	{
	// 		prisma: Prisma,
	// 		tableName: 'Document',
	// 		vectorColumnName: 'vector',
	// 		columns: {
	// 			id: PrismaVectorStore.IdColumn,
	// 			content: PrismaVectorStore.ContentColumn,
	// 		},
	// 		filter: {
	// 			content: {
	// 				equals: 'default',
	// 			},
	// 		},
	// 	},
	// );

	// await vectorStore2.addModels(
	// 	await prisma.$transaction(
	// 		texts.map((content) => prisma.document.create({ data: { content } })),
	// 	),
	// );

	// // Use the default filter a.k.a {"content": "default"}
	// const resultTwo = await vectorStore.similaritySearch('Hello world', 1);
	// console.log(resultTwo);

	// // Override the local filter
	// const resultThree = await vectorStore.similaritySearchWithScore(
	// 	'Hello world',
	// 	1,
	// 	{ content: { equals: 'different_content' } },
	// );
	// console.log(resultThree);
};

export async function GET(req: Request) {
	await run();

	return {
		success: true,
	};
}
