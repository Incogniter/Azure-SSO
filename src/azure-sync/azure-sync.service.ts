import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

@Injectable()
export class AzureSyncService {
  private readonly logger = new Logger(AzureSyncService.name);

  private getGraphClient(accessToken: string) {
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  async syncUsersAndRoles(accessToken: string): Promise<void> {
    const client = this.getGraphClient(accessToken);

    try {
      const users = await client
        .api('/users')
        .select('id,displayName,userPrincipalName')
        .get();

      for (const user of users.value) {
        // const groups = await client
        //   .api(`/users/${user.id}/memberOf`)
        //   .get();

        // const mappedRoles = this.mapGroupsToRoles(groups.value);

        await this.saveUserRolesToDB({
          id: user.id,
          name: user.displayName,
          email: user.userPrincipalName,
          // roles: mappedRoles,
        });
      }

      this.logger.log('Azure AD users and roles synced successfully');
    } catch (err) {
      this.logger.error('Failed to sync Azure AD users', err.message);
    }
  }

  // private mapGroupsToRoles(groups: any[]): string[] {
  //   const groupIdToRoleMap: Record<string, string> = {
  //     'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx': 'Admin',
  //     'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy': 'Manager',
  //     'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz': 'User',
  //   };

  //   return groups
  //     .map((group) => groupIdToRoleMap[group.id])
  //     .filter((role) => !!role);
  // }

  private async saveUserRolesToDB(user: {
    id: string;
    name: string;
    email: string;
    // roles: string[];
  }): Promise<void> {
    console.log('Saving to DB:', user);
  }
}