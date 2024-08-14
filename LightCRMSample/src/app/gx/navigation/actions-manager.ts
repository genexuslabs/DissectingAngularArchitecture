import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
/**
 * Implements running actions synchronization and behavior
 */
export class ActionsManager {

  nextActionIdToComplete: number;
  private actionsData = new RunningActionsState();

  /**
   * Saves result to be returned given action
   * @param actionId
   *      Id of the awaiting action
   * @param result
   *      Data to return
   */
  saveResult(iid: number, actionId: number, result) {
    this.actionsData.saveResult(iid, actionId, result); // Abort here!!!
  }

  /**
   * Waits for navigation to complete and gathers its result
   * @param actionId
   *      Id of the awaiting action
   */
  async waitForResult(iid: number, actionId: number): Promise<any> {
    return new Promise<any>((complete) => {
      const pendingNavigation = this.actionsData.createPendingNavigation(iid, actionId);
      pendingNavigation.subscribe((result) => {
        complete(result);
      });
    });
  }

  /**
   * Signals pending navigation completion and awaits for action to complete
   *   - resumes actions waiting for result ('waitForResult')
   *   - waits for action completion
   * @param actionId
   *      Id of the action to resume
   */
  async resumePendingAction(iid: number): Promise<any> {
    const actionId = this.nextActionIdToComplete ?? 0;
    return new Promise((complete) => {
      if (actionId) {
        if (this.actionsData.completePendingNavigation(iid, actionId)) {
          const completedEvent = this.actionsData.createPendingAction(iid, actionId);
          completedEvent.subscribe((result) => {
            complete(result);
          });
        }
        else {
          complete(null);
        }
      } else {
        complete(null);
      }
    });
  }

  /**
   * Completes pending action execution
   * @param actionId
   */
  endEvent(iid: number, actionId: number) {
    this.actionsData.completePendingAction(iid, actionId);
  }

  getNewActionId() {
    const actionId = this.actionsData.newRuntimeActionId();
    return actionId;
  }

}

/**
 * Implements running action state maintenance.
 * 
 * Actions lifecycle:
 * 
 *     1) Action 'actionId' starts in panel 'iid' 
 * 
 *     2) Navigating to another panel from action 'actionId' ->
 *       createPendingNavigation(iid, actionId)
 * 
 *     3) navigated panel ends ->
 *       saveResult(iid, actionId, ...)
 * 
 *     4) Panel 'iid' resumes and tries to complete 'actionId' execution->
 *         completePendingNavigation(iid,actionId)
 *         createPendingAction(iid, actionId)
 * 
 *     5) Action 'actionId' finishes -> 
 *         completePendingAction(iid,actionId)
 */
class RunningActionsState {
  pendingNavigations = {};
  completedEvents = {};
  navigationResult = {};
  nextRuntimeActionId = 1;

  newRuntimeActionId() {
    return this.nextRuntimeActionId++;
  }

  private getStateKey(iid, actionId) {
    return `${iid} ${actionId}`;
  }

  createPendingNavigation(iid: number, actionId: number) {
    const nvgKey = this.getStateKey(iid, actionId);
    let pendingNavigation = this.pendingNavigations[nvgKey];
    if (!pendingNavigation) {
      pendingNavigation = new Subject<any>();
      this.pendingNavigations[nvgKey] = pendingNavigation;
    }
    return pendingNavigation;
  }

  saveResult(iid: number, actionId: number, result) {
    const nvgKey = this.getStateKey(iid, actionId);
    this.navigationResult[nvgKey] = result;
  }

  completePendingNavigation(iid: number, actionId: number) {
    const nvgKey = this.getStateKey(iid, actionId);
    const pendingNavigation = this.pendingNavigations[nvgKey];
    if (pendingNavigation) {
      this.pendingNavigations[nvgKey] = null;
      const result = this.navigationResult[nvgKey];
      pendingNavigation.next(result);
      pendingNavigation.complete();
      return true;
    } else {
      return false;
    }
  }

  createPendingAction(iid: number, actionId: number) {
    const nvgKey = this.getStateKey(iid, actionId);
    let completedEvent = this.completedEvents[nvgKey];
    if (!completedEvent) {
      completedEvent = new Subject<any>();
      this.completedEvents[nvgKey] = completedEvent;
    }
    return completedEvent;
  }

  completePendingAction(iid: number, actionId: number) {
    const nvgKey = this.getStateKey(iid, actionId);
    const completedEvent = this.completedEvents[nvgKey];
    if (completedEvent) {
      completedEvent.next(actionId);
      completedEvent.complete(actionId);
    }
  }
}
