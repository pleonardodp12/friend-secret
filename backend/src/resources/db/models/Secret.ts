import { Schema, model } from "mongoose";

export interface IParticipants {
  _id: boolean;
  externalId: string;
  email: string;
  name: string;
}

interface IResult {
  _id: boolean;
  giver: string;
  receiver: string;
}

interface ISchemaSecret {
  _id: string;
  owner: string;
  ownerEmail: string;
  adminKey: string,
  externalId: String,
  participants: IParticipants[],
  drawResult: IResult[],
}

const secretSchema = new Schema<ISchemaSecret>({
  owner: String,
  ownerEmail: String,
  adminKey: String,
  externalId: String,
  participants: [{
    _id: false,
    externalId: String,
    email: String,
    name: String,
  }],
  drawResult: [{
    _id: false,
    giver: String,
    receiver: String,
  }],
})

const SecretModel = model<ISchemaSecret>('Secret', secretSchema)

export default SecretModel;