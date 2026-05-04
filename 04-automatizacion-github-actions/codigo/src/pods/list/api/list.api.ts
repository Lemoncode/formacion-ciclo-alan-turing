import { Member } from './list.api-model';

export const getMemberList = async (organization: string): Promise<Member[]> =>
  await fetch(`https://api.github.com/orgs/${organization}/members`).then(
    (response) => response.json()
  );
