"use server"
import { driver } from "@/db"
import { Neo4JUser } from "@/types";

// --- User-Related Functions ---

export const getUserById = async (id: string) => {
  const result = await driver.executeQuery(
    `MATCH (u:User { applicationId: $applicationId }) RETURN u`,
    { applicationId: id }
  );

  const users = result.records.map((record) => record.get("u").properties);
  if (users.length === 0) return null;
  return users[0] as Neo4JUser;
};

export const createUser = async (user: Neo4JUser) => {
  const { applicationId, email, firstName, lastName } = user;
  await driver.executeQuery(
    `CREATE (u:User { applicationId: $applicationId, email: $email, firstName: $firstName, lastName: $lastName })`,
    { applicationId, email, firstName, lastName }
  );
};

export const updateUser = async (user: Neo4JUser) => {
  const { applicationId, email, firstName, lastName } = user;
  await driver.executeQuery(
    `MATCH (u:User { applicationId: $applicationId }) 
     SET u.email = $email, u.firstName = $firstName, u.lastName = $lastName`,
    { applicationId, email, firstName, lastName }
  );
};

export const deleteUser = async (id: string) => {
  await driver.executeQuery(
    `MATCH (u:User { applicationId: $applicationId }) DETACH DELETE u`,
    { applicationId: id }
  );
};

// --- Question and Answer Functions ---

interface Question {
  id: number;
  text: string;
}

export const getQuestions = async (): Promise<Question[]> => {
  const result = await driver.executeQuery('MATCH (q:Question) RETURN q');
  const questions = result.records.map((record) => record.get("q").properties);
  return questions as Question[];
};

export const saveAnswer = async (userId: string, questionId: number, answer: string) => {
  await driver.executeQuery(
    'MATCH (u:User {applicationId: $userId}), (q:Question {id: $questionId}) ' +
    'MERGE (u)-[a:ANSWERED {answer: $answer}]->(q)', 
    { userId, questionId, answer }
  );
};

// --- Match Result Functions ---

interface Match {
  shape: string;
  description: string;
}

export const getMatchResult = async (userId: string): Promise<Match | null> => {
  // Example query (adapt to your specific match logic)
  const result = await driver.executeQuery(
    `MATCH (u:User {applicationId: $userId})-[a:ANSWERED]->(q:Question) 
     WITH u, collect(a.answer) AS answers 
     // ... your matching logic based on 'answers' ...
     RETURN m as match`, // Return the matched shape node (m)
    { userId }
  );

  if (result.records.length > 0) {
    return result.records[0].get('match').properties as Match;
  } else {
    return null; 
  }
};