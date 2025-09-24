// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'test_dummy_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class TestDummyModelAdapter extends TypeAdapter<TestDummyModel> {
  @override
  final int typeId = 99;

  @override
  TestDummyModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return TestDummyModel(
      name: fields[0] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, TestDummyModel obj) {
    writer
      ..writeByte(1)
      ..writeByte(0)
      ..write(obj.name);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TestDummyModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
